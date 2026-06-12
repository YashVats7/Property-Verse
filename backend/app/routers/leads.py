"""Lead capture endpoints: waitlist, partner, strategy call."""
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from ..db import db

router = APIRouter(tags=["leads"])


class WaitlistRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    investment_range: Optional[str] = None
    source: str = "investor_waitlist"


class PartnerRequest(BaseModel):
    name: str
    email: EmailStr
    company: str
    role: str
    partnership_type: str
    message: Optional[str] = None


class StrategyCallRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    preferred_time: Optional[str] = None
    investment_size: Optional[str] = None
    notes: Optional[str] = None


@router.post("/waitlist")
async def join_waitlist(body: WaitlistRequest):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads_waitlist.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


@router.post("/partner")
async def submit_partner(body: PartnerRequest):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads_partners.insert_one(doc)
    return {"ok": True, "id": doc["id"]}


@router.post("/strategy-call")
async def book_strategy_call(body: StrategyCallRequest):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads_strategy_calls.insert_one(doc)
    return {"ok": True, "id": doc["id"]}
