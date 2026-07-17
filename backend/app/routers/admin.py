"""Admin endpoints — leads, users, opportunity CRUD, content blocks, image upload, reset."""
import os
import uuid
from pathlib import Path
from typing import Optional, Any
from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from pydantic import BaseModel

from ..db import db
from ..security import require_admin
from ..seed import reset_opportunities_to_defaults, upsert_content

router = APIRouter(prefix="/admin", tags=["admin"])

UPLOAD_DIR = Path("/app/frontend/public/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def _valid_image_bytes(ext: str, data: bytes) -> bool:
    """Magic-byte validation: file content must match its claimed extension."""
    if len(data) < 12:
        return False
    if ext == ".png":
        return data[:8] == b"\x89PNG\r\n\x1a\n"
    if ext in (".jpg", ".jpeg"):
        return data[:3] == b"\xff\xd8\xff"
    if ext == ".gif":
        return data[:4] in (b"GIF8",)
    if ext == ".webp":
        return data[:4] == b"RIFF" and data[8:12] == b"WEBP"
    return False


async def _audit(admin: dict, action: str, target: str, detail: str = "") -> None:
    await db.audit_log.insert_one({
        "id": str(uuid.uuid4()),
        "admin_email": admin.get("email", "unknown"),
        "action": action,
        "target": target,
        "detail": detail[:300],
        "created_at": datetime.now(timezone.utc).isoformat(),
    })


def _serialize(doc: Optional[dict]) -> Optional[dict]:
    if not doc:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id_mongo"] = str(doc["_id"])
        doc.pop("_id", None)
    doc.setdefault("id", doc.get("id_mongo"))
    doc.pop("password_hash", None)
    return doc


# ---------------- Stats / overview ----------------
@router.get("/stats")
async def admin_stats(_=Depends(require_admin)) -> dict:
    return {
        "waitlist": await db.leads_waitlist.count_documents({}),
        "partners": await db.leads_partners.count_documents({}),
        "strategy_calls": await db.leads_strategy_calls.count_documents({}),
        "users": await db.users.count_documents({}),
        "investors": await db.users.count_documents({"role": "investor"}),
        "opportunities": await db.opportunities.count_documents({}),
    }


# ---------------- Leads / users ----------------
@router.get("/leads/waitlist")
async def list_waitlist(_=Depends(require_admin), source: Optional[str] = None, limit: int = Query(200, ge=1, le=500)) -> dict:
    q = {"source": source} if source else {}
    cursor = db.leads_waitlist.find(q).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.get("/leads/partners")
async def list_partners(_=Depends(require_admin), limit: int = Query(200, ge=1, le=500)) -> dict:
    cursor = db.leads_partners.find({}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.get("/leads/strategy-calls")
async def list_strategy_calls(_=Depends(require_admin), limit: int = Query(200, ge=1, le=500)) -> dict:
    cursor = db.leads_strategy_calls.find({}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.get("/users")
async def list_users(_=Depends(require_admin), limit: int = Query(200, ge=1, le=500)) -> dict:
    cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.delete("/leads/{collection}/{lead_id}")
async def delete_lead(collection: str, lead_id: str, admin: dict = Depends(require_admin)) -> dict:
    coll_map = {"waitlist": db.leads_waitlist, "partners": db.leads_partners, "strategy-calls": db.leads_strategy_calls}
    coll = coll_map.get(collection)
    if coll is None:
        raise HTTPException(status_code=400, detail="Unknown collection")
    try:
        oid = ObjectId(lead_id)
        res = await coll.delete_one({"_id": oid})
    except Exception:
        res = await coll.delete_one({"id": lead_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    await _audit(admin, "delete_lead", f"{collection}/{lead_id}")
    return {"ok": True}


# ---------------- Opportunities CRUD ----------------
class OpportunityIn(BaseModel):
    id: Optional[str] = None
    name: str
    location: str
    asset_type: str
    tenant: str = ""
    image: Optional[str] = None
    image_fallback: Optional[str] = None
    min_investment: int = 0
    asset_value_cr: int = 0
    target_irr: float = 0
    target_irr_range: str = ""
    rental_yield: float = 0
    lease_term_years: int = 0
    occupancy: int = 100
    tenure_years: int = 6
    funded_pct: int = 0
    leverage_available: bool = False
    risk_score: int = 0
    tags: list[str] = []
    highlight: str = ""


@router.get("/opportunities")
async def list_admin_opps(_=Depends(require_admin)) -> dict:
    cursor = db.opportunities.find({}).sort("order", 1)
    items = []
    async for d in cursor:
        d.pop("_id", None)
        items.append(d)
    return {"items": items}


@router.post("/opportunities")
async def create_opp(body: OpportunityIn, admin: dict = Depends(require_admin)) -> dict:
    doc = body.model_dump()
    if not doc.get("id"):
        slug = (doc["name"] or "opp").lower().replace(" ", "-")[:40]
        doc["id"] = f"opp-{slug}-{uuid.uuid4().hex[:6]}"
    if await db.opportunities.find_one({"id": doc["id"]}):
        raise HTTPException(status_code=400, detail="ID already exists")
    count = await db.opportunities.count_documents({})
    doc["order"] = count
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.opportunities.insert_one(doc)
    doc.pop("_id", None)
    await _audit(admin, "create_opportunity", doc["id"], doc.get("name", ""))
    return doc


@router.put("/opportunities/{opp_id}")
async def update_opp(opp_id: str, body: OpportunityIn, admin: dict = Depends(require_admin)) -> dict:
    doc = body.model_dump(exclude_unset=True)
    doc.pop("id", None)
    doc["updated_at"] = datetime.now(timezone.utc).isoformat()
    res = await db.opportunities.update_one({"id": opp_id}, {"$set": doc})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    out = await db.opportunities.find_one({"id": opp_id})
    out.pop("_id", None)
    await _audit(admin, "update_opportunity", opp_id, out.get("name", ""))
    return out


@router.delete("/opportunities/{opp_id}")
async def delete_opp(opp_id: str, admin: dict = Depends(require_admin)) -> dict:
    res = await db.opportunities.delete_one({"id": opp_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    await _audit(admin, "delete_opportunity", opp_id)
    return {"ok": True}


@router.post("/opportunities/reset")
async def reset_opps(admin: dict = Depends(require_admin)) -> dict:
    await reset_opportunities_to_defaults()
    await _audit(admin, "reset_opportunities", "all")
    return {"ok": True, "count": await db.opportunities.count_documents({})}


# ---------------- Content blocks (stats, hero, about, personas, …) ----------------
class ContentIn(BaseModel):
    value: Any


@router.get("/content/{key}")
async def get_content_admin(key: str, _=Depends(require_admin)) -> Any:
    doc = await db.content.find_one({"key": key})
    if not doc:
        raise HTTPException(status_code=404, detail="Not found")
    return doc.get("value")


@router.put("/content/{key}")
async def put_content_admin(key: str, body: ContentIn, admin: dict = Depends(require_admin)) -> dict:
    await upsert_content(key, body.value)
    await _audit(admin, "update_content", key)
    return {"ok": True, "key": key}


# ---------------- Audit log ----------------
@router.get("/audit-log")
async def get_audit_log(_=Depends(require_admin), limit: int = Query(200, ge=1, le=500)) -> dict:
    cursor = db.audit_log.find({}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


# ---------------- Image upload ----------------
@router.post("/upload")
async def upload_image(file: UploadFile = File(...), admin: dict = Depends(require_admin)) -> dict:
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail=f"Unsupported extension. Allowed: {sorted(ALLOWED_EXT)}")
    data = await file.read()
    if len(data) > 6 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large (max 6 MB)")
    if not _valid_image_bytes(ext, data):
        raise HTTPException(status_code=400, detail="File content does not match a valid image format")
    name = f"{uuid.uuid4().hex}{ext}"
    out_path = UPLOAD_DIR / name
    out_path.write_bytes(data)
    await _audit(admin, "upload_image", name, f"{len(data)} bytes")
    return {"url": f"/uploads/{name}", "size": len(data)}
