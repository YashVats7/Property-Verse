"""Per-opportunity PDF generator (email-gated). Public endpoint that
captures email lead + returns a one-page asset summary PDF.
"""
import io
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field

from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

from ..db import db
from ..ratelimit import limiter

router = APIRouter(tags=["pdf"])

PV_NAVY = HexColor("#0A2540")
PV_BLUE = HexColor("#1E63D5")
PV_GREEN = HexColor("#3FB36F")
PV_SLATE = HexColor("#64748B")


class PdfRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    website: Optional[str] = None  # honeypot


def _inr(n: int) -> str:
    if n is None: return "—"
    if n >= 10_000_000: return f"Rs. {n/10_000_000:.2f} Cr"
    if n >= 100_000: return f"Rs. {n/100_000:.1f} L"
    return f"Rs. {n:,}"


def _draw_summary(c: canvas.Canvas, o: dict, lead: dict):
    w, h = A4
    # Header band
    c.setFillColor(PV_NAVY)
    c.rect(0, h - 30 * mm, w, 30 * mm, stroke=0, fill=1)
    c.setFillColor(PV_GREEN)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(20 * mm, h - 14 * mm, "PROPERTY VERSE  ·  ASSET SUMMARY  ·  ILLUSTRATIVE")
    c.setFillColorRGB(1, 1, 1)
    c.setFont("Helvetica-Bold", 18)
    c.drawString(20 * mm, h - 22 * mm, o.get("name", "Opportunity"))
    c.setFont("Helvetica", 10)
    c.drawString(20 * mm, h - 27 * mm, o.get("location", ""))

    # KPI grid
    y0 = h - 50 * mm
    items = [
        ("Asset Value", f"Rs. {o.get('asset_value_cr', 0)} Cr"),
        ("Target IRR", o.get("target_irr_range") or f"{o.get('target_irr', 0)}%"),
        ("Rental Yield", f"{o.get('rental_yield', 0)}%"),
        ("Min Investment", _inr(o.get("min_investment", 0))),
        ("Tenure", f"{o.get('tenure_years', 0)} years"),
        ("Occupancy", f"{o.get('occupancy', 0)}%"),
    ]
    col_w = (w - 40 * mm) / 3
    for i, (l, v) in enumerate(items):
        col, row = i % 3, i // 3
        x = 20 * mm + col * col_w
        y = y0 - row * 22 * mm
        c.setStrokeColor(HexColor("#E2E8F0"))
        c.setFillColor(HexColor("#F8FAFC"))
        c.roundRect(x, y - 18 * mm, col_w - 4 * mm, 18 * mm, 3, stroke=1, fill=1)
        c.setFillColor(PV_SLATE); c.setFont("Helvetica-Bold", 7)
        c.drawString(x + 4 * mm, y - 6 * mm, l.upper())
        c.setFillColor(PV_NAVY); c.setFont("Helvetica-Bold", 16)
        c.drawString(x + 4 * mm, y - 14 * mm, v)

    # Highlight box
    y_hl = y0 - 60 * mm
    c.setFillColor(HexColor("#F0FDF4"))
    c.setStrokeColor(PV_GREEN)
    c.roundRect(20 * mm, y_hl - 25 * mm, w - 40 * mm, 25 * mm, 4, stroke=1, fill=1)
    c.setFillColor(PV_GREEN); c.setFont("Helvetica-Bold", 8)
    c.drawString(24 * mm, y_hl - 6 * mm, "HIGHLIGHT")
    c.setFillColor(PV_NAVY); c.setFont("Helvetica", 10)
    highlight = (o.get("highlight") or "")[:280]
    # crude word wrap
    line_y = y_hl - 12 * mm
    words = highlight.split(); buf = ""
    for w_ in words:
        test = (buf + " " + w_).strip()
        if c.stringWidth(test, "Helvetica", 10) > w - 50 * mm:
            c.drawString(24 * mm, line_y, buf); buf = w_; line_y -= 5 * mm
        else:
            buf = test
    if buf: c.drawString(24 * mm, line_y, buf)

    # Tenant + lease
    y_t = y_hl - 35 * mm
    c.setFillColor(PV_NAVY); c.setFont("Helvetica-Bold", 11)
    c.drawString(20 * mm, y_t, "Tenant profile")
    c.setFillColor(PV_SLATE); c.setFont("Helvetica", 10)
    c.drawString(20 * mm, y_t - 6 * mm, f"{o.get('tenant', '—')}  ·  Lease term {o.get('lease_term_years', 0)} years")

    # Leverage callout
    if o.get("leverage_available"):
        y_lv = y_t - 20 * mm
        c.setFillColor(PV_BLUE)
        c.roundRect(20 * mm, y_lv - 14 * mm, w - 40 * mm, 14 * mm, 4, stroke=0, fill=1)
        c.setFillColorRGB(1, 1, 1); c.setFont("Helvetica-Bold", 9)
        c.drawString(24 * mm, y_lv - 6 * mm, "LEVERAGED FRACTIONAL ASSET ELIGIBLE")
        c.setFont("Helvetica", 8)
        c.drawString(24 * mm, y_lv - 11 * mm, "Bank/NBFC-backed debt participation available — subject to lender approval.")

    # Footer
    c.setFillColor(PV_SLATE); c.setFont("Helvetica-Oblique", 7)
    msg = ("All figures shown are illustrative only. Not investment advice. Real estate investments carry risk "
           "including capital loss. Returns are projected and not guaranteed.")
    c.drawString(20 * mm, 18 * mm, msg[:120]); c.drawString(20 * mm, 14 * mm, msg[120:])
    c.setFillColor(PV_NAVY); c.setFont("Helvetica-Bold", 8)
    c.drawString(20 * mm, 8 * mm, f"Prepared for: {lead.get('name')} ({lead.get('email')})")
    c.setFillColor(PV_SLATE); c.setFont("Helvetica", 7)
    c.drawRightString(w - 20 * mm, 8 * mm, datetime.now(timezone.utc).strftime("%d %b %Y · propertyverse.in"))


@router.post("/opportunities/{opp_id}/pdf")
@limiter.limit("5/minute")
async def generate_pdf(opp_id: str, body: PdfRequest, request: Request):
    if body.website:
        raise HTTPException(status_code=400, detail="Invalid submission")
    opp = await db.opportunities.find_one({"id": opp_id})
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    # Capture lead
    lead_doc = {
        "id": str(uuid.uuid4()),
        "name": body.name.strip(),
        "email": body.email.lower().strip(),
        "phone": body.phone,
        "opportunity_id": opp_id,
        "opportunity_name": opp.get("name"),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads_pdf_downloads.insert_one(dict(lead_doc))
    # Also drop into waitlist as a soft signal
    await db.leads_waitlist.insert_one({
        **lead_doc, "id": str(uuid.uuid4()),
        "source": "pdf_download",
        "investment_range": None,
    })

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    _draw_summary(c, opp, lead_doc)
    c.showPage(); c.save()
    buf.seek(0)

    filename = f"PropertyVerse-{(opp.get('name') or 'asset').replace(' ', '_')}.pdf"
    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
