"""Lead capture endpoints: waitlist, partner, strategy call.
Hardened: per-IP rate limits, honeypot anti-bot field, input length limits.
"""
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Request
from pydantic import BaseModel, EmailStr, Field

from ..db import db
from ..ratelimit import limiter

router = APIRouter(tags=["leads"])


class WaitlistRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=20)
    investment_range: Optional[str] = Field(default=None, max_length=60)
    source: str = Field(default="investor_waitlist", max_length=60)
    website: Optional[str] = None  # honeypot — bots fill this, humans never see it


class PartnerRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    company: str = Field(min_length=1, max_length=120)
    role: str = Field(min_length=1, max_length=80)
    partnership_type: str = Field(min_length=1, max_length=80)
    message: Optional[str] = Field(default=None, max_length=1000)
    website: Optional[str] = None  # honeypot


class StrategyCallRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=20)
    preferred_time: Optional[str] = Field(default=None, max_length=60)
    investment_size: Optional[str] = Field(default=None, max_length=60)
    notes: Optional[str] = Field(default=None, max_length=1000)
    website: Optional[str] = None  # honeypot


def _prep(body) -> Optional[dict]:
    """Returns lead doc, or None if honeypot tripped (silently discard)."""
    if body.website:
        return None
    doc = body.model_dump(exclude={"website"})
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    return doc


@router.post("/waitlist")
@limiter.limit("10/minute")
async def join_waitlist(body: WaitlistRequest, request: Request):
    doc = _prep(body)
    if doc is None:
        return {"ok": True, "id": str(uuid.uuid4())}
    await db.leads_waitlist.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


@router.post("/partner")
@limiter.limit("10/minute")
async def submit_partner(body: PartnerRequest, request: Request):
    doc = _prep(body)
    if doc is None:
        return {"ok": True, "id": str(uuid.uuid4())}
    await db.leads_partners.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


@router.post("/strategy-call")
@limiter.limit("10/minute")
async def book_strategy_call(body: StrategyCallRequest, request: Request):
    doc = _prep(body)
    if doc is None:
        return {"ok": True, "id": str(uuid.uuid4())}
    await db.leads_strategy_calls.insert_one(doc)
    return {"ok": True, "id": doc["id"]}
