"""Opportunities endpoints."""
from typing import Optional
from fastapi import APIRouter, HTTPException
from ..seed import SAMPLE_OPPORTUNITIES

router = APIRouter(tags=["opportunities"])


@router.get("/opportunities")
async def list_opportunities(asset_type: Optional[str] = None, city: Optional[str] = None):
    items = SAMPLE_OPPORTUNITIES
    if asset_type and asset_type != "all":
        items = [o for o in items if o["asset_type"].lower() == asset_type.lower()]
    if city and city != "all":
        items = [o for o in items if city.lower() in o["location"].lower()]
    return {"items": items, "total": len(items)}


@router.get("/opportunities/{opp_id}")
async def get_opportunity(opp_id: str):
    for o in SAMPLE_OPPORTUNITIES:
        if o["id"] == opp_id:
            return o
    raise HTTPException(status_code=404, detail="Opportunity not found")


@router.get("/stats")
async def platform_stats():
    return {
        "aum_inr_cr": 1240,
        "investors": 18500,
        "properties": 47,
        "avg_irr": 15.8,
        "cities": 9,
        "occupancy_pct": 98,
    }
