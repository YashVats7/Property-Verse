"""Opportunities — public reads now sourced from MongoDB."""
from typing import Any, Optional
from fastapi import APIRouter, HTTPException

from ..db import db

router = APIRouter(tags=["opportunities"])


def _clean(doc: Optional[dict]) -> Optional[dict]:
    if not doc:
        return None
    doc = dict(doc)
    doc.pop("_id", None)
    doc.pop("updated_at", None)
    doc.pop("order", None)
    return doc


@router.get("/opportunities")
async def list_opportunities(asset_type: Optional[str] = None, city: Optional[str] = None) -> dict:
    q: dict = {}
    if asset_type and asset_type != "all":
        q["asset_type"] = {"$regex": f"^{asset_type}$", "$options": "i"}
    cursor = db.opportunities.find(q).sort("order", 1)
    items = [_clean(d) async for d in cursor]
    if city and city != "all":
        items = [o for o in items if city.lower() in o.get("location", "").lower()]
    return {"items": items, "total": len(items)}


@router.get("/opportunities/{opp_id}")
async def get_opportunity(opp_id: str) -> dict:
    doc = await db.opportunities.find_one({"id": opp_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Opportunity not found")
    return _clean(doc)


@router.get("/stats")
async def platform_stats() -> dict:
    doc = await db.content.find_one({"key": "stats"})
    return (doc or {}).get("value", {})


@router.get("/content/{key}")
async def get_content(key: str) -> Any:
    doc = await db.content.find_one({"key": key})
    if not doc:
        raise HTTPException(status_code=404, detail="Content not found")
    return doc.get("value")
