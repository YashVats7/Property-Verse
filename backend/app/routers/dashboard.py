"""Investor dashboard endpoints (auth required) — reads opportunities from MongoDB."""
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from ..db import db
from ..security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class WatchlistRequest(BaseModel):
    opportunity_id: str


def _clean(d):
    d = dict(d)
    d.pop("_id", None)
    d.pop("updated_at", None)
    d.pop("order", None)
    return d


@router.get("")
async def dashboard(user: dict = Depends(get_current_user)):
    full = await db.users.find_one({"_id": ObjectId(user["id"])})
    watchlist_ids = (full or {}).get("watchlist", [])
    watchlist = []
    if watchlist_ids:
        async for d in db.opportunities.find({"id": {"$in": watchlist_ids}}).sort("order", 1):
            watchlist.append(_clean(d))
    recommended = []
    async for d in db.opportunities.find({}).sort("order", 1).limit(3):
        recommended.append(_clean(d))
    return {
        "portfolio_value_inr": 0,
        "watchlist": watchlist,
        "recommended": recommended,
        "user": {"name": user.get("name"), "email": user["email"]},
    }


@router.post("/watchlist")
async def add_watchlist(body: WatchlistRequest, user: dict = Depends(get_current_user)):
    if not await db.opportunities.find_one({"id": body.opportunity_id}):
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
