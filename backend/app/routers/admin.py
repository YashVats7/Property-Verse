"""Admin endpoints to triage leads + users. Admin-only access."""
from typing import Optional
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Query

from ..db import db
from ..security import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


def _serialize(doc):
    if not doc:
        return None
    doc = dict(doc)
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
    doc.pop("password_hash", None)
    return doc


@router.get("/stats")
async def admin_stats(_=Depends(require_admin)):
    return {
        "waitlist": await db.leads_waitlist.count_documents({}),
        "partners": await db.leads_partners.count_documents({}),
        "strategy_calls": await db.leads_strategy_calls.count_documents({}),
        "users": await db.users.count_documents({}),
        "investors": await db.users.count_documents({"role": "investor"}),
    }


@router.get("/leads/waitlist")
async def list_waitlist(
    _=Depends(require_admin),
    source: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
):
    q = {}
    if source:
        q["source"] = source
    cursor = db.leads_waitlist.find(q).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.get("/leads/partners")
async def list_partners(_=Depends(require_admin), limit: int = Query(100, ge=1, le=500)):
    cursor = db.leads_partners.find({}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.get("/leads/strategy-calls")
async def list_strategy_calls(_=Depends(require_admin), limit: int = Query(100, ge=1, le=500)):
    cursor = db.leads_strategy_calls.find({}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.get("/users")
async def list_users(_=Depends(require_admin), limit: int = Query(100, ge=1, le=500)):
    cursor = db.users.find({}, {"password_hash": 0}).sort("created_at", -1).limit(limit)
    return {"items": [_serialize(d) async for d in cursor]}


@router.delete("/leads/{collection}/{lead_id}")
async def delete_lead(collection: str, lead_id: str, _=Depends(require_admin)):
    coll_map = {
        "waitlist": db.leads_waitlist,
        "partners": db.leads_partners,
        "strategy-calls": db.leads_strategy_calls,
    }
    coll = coll_map.get(collection)
    if coll is None:
        raise HTTPException(status_code=400, detail="Unknown collection")
    try:
        oid = ObjectId(lead_id)
    except Exception:
        await coll.delete_one({"id": lead_id})
        return {"ok": True}
    res = await coll.delete_one({"_id": oid})
    return {"ok": res.deleted_count > 0}
