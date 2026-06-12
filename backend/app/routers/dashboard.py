"""Investor dashboard endpoints (auth required)."""
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..db import db
from ..security import get_current_user
from ..seed import SAMPLE_OPPORTUNITIES

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class WatchlistRequest(BaseModel):
    opportunity_id: str


@router.get("")
async def dashboard(user: dict = Depends(get_current_user)):
    full = await db.users.find_one({"_id": ObjectId(user["id"])})
    watchlist_ids = (full or {}).get("watchlist", [])
    watchlist = [o for o in SAMPLE_OPPORTUNITIES if o["id"] in watchlist_ids]
    return {
        "portfolio_value_inr": 0,
        "watchlist": watchlist,
        "recommended": SAMPLE_OPPORTUNITIES[:3],
        "user": {"name": user.get("name"), "email": user["email"]},
    }


@router.post("/watchlist")
async def add_watchlist(body: WatchlistRequest, user: dict = Depends(get_current_user)):
    if not any(o["id"] == body.opportunity_id for o in SAMPLE_OPPORTUNITIES):
        raise HTTPException(status_code=404, detail="Opportunity not found")
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$addToSet": {"watchlist": body.opportunity_id}},
    )
    return {"ok": True}


@router.delete("/watchlist/{opp_id}")
async def remove_watchlist(opp_id: str, user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$pull": {"watchlist": opp_id}},
    )
    return {"ok": True}
