from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
import bcrypt
import jwt as pyjwt
import secrets as py_secrets
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr, BeforeValidator
from bson import ObjectId

# ----------------- MongoDB -----------------
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ----------------- App + Router -----------------
app = FastAPI(title="Property Verse API")
api_router = APIRouter(prefix="/api")

# ----------------- Helpers -----------------
JWT_ALGORITHM = "HS256"

def _jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=60),
        "type": "access",
    }
    return pyjwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return pyjwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)

def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True, samesite="none", max_age=604800, path="/")

def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(token, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password_hash", None)
        return user
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ----------------- Models -----------------
class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str = "investor"

class WaitlistRequest(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    investment_range: Optional[str] = None
    source: str = "investor_waitlist"  # investor_waitlist | leverage_waitlist

class PartnerRequest(BaseModel):
    name: str
    email: EmailStr
    company: str
    role: str
    partnership_type: str  # builder | bank_nbfc | wealth_manager | other
    message: Optional[str] = None

class StrategyCallRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    preferred_time: Optional[str] = None
    investment_size: Optional[str] = None
    notes: Optional[str] = None

class WatchlistRequest(BaseModel):
    opportunity_id: str

# ----------------- Auth Endpoints -----------------
@api_router.post("/auth/register", response_model=UserOut)
async def register(body: RegisterRequest, response: Response):
    email = body.email.lower().strip()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    doc = {
        "name": body.name.strip(),
        "email": email,
        "password_hash": hash_password(body.password),
        "role": "investor",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "watchlist": [],
    }
    res = await db.users.insert_one(doc)
    uid = str(res.inserted_id)
    set_auth_cookies(response, create_access_token(uid, email), create_refresh_token(uid))
    return UserOut(id=uid, name=doc["name"], email=email, role="investor")

@api_router.post("/auth/login", response_model=UserOut)
async def login(body: LoginRequest, request: Request, response: Response):
    email = body.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        locked_until = attempt.get("locked_until")
        if locked_until and datetime.now(timezone.utc) < datetime.fromisoformat(locked_until):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try later.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        new_count = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"count": new_count, "updated_at": datetime.now(timezone.utc).isoformat()}
        if new_count >= 5:
            update["locked_until"] = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="Invalid credentials")

    await db.login_attempts.delete_one({"identifier": identifier})
    uid = str(user["_id"])
    set_auth_cookies(response, create_access_token(uid, email), create_refresh_token(uid))
    return UserOut(id=uid, name=user.get("name", ""), email=email, role=user.get("role", "investor"))

@api_router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"ok": True}

@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(id=user["id"], name=user.get("name", ""), email=user["email"], role=user.get("role", "investor"))

@api_router.post("/auth/refresh")
async def refresh_token(request: Request, response: Response):
    rt = request.cookies.get("refresh_token")
    if not rt:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = pyjwt.decode(rt, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        new_access = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie("access_token", new_access, httponly=True, secure=True, samesite="none", max_age=3600, path="/")
        return {"ok": True}
    except pyjwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

# ----------------- Opportunities (Seed data) -----------------
SAMPLE_OPPORTUNITIES = [
    {
        "id": "opp-blr-grade-a",
        "name": "Grade-A Office Park",
        "location": "Outer Ring Road, Bengaluru",
        "asset_type": "A-Grade Office",
        "tenant": "Global Technology Company",
        "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85",
        "min_investment": 1000000,
        "asset_value_cr": 80,
        "target_irr": 16.0,
        "target_irr_range": "15-17%",
        "rental_yield": 8.5,
        "lease_term_years": 9,
        "occupancy": 100,
        "tenure_years": 6,
        "funded_pct": 64,
        "leverage_available": True,
        "risk_score": 78,
        "tags": ["Pre-Leased", "A-Grade", "Leverage Available"],
        "highlight": "Bengaluru's premier ORR corridor; pre-leased to a global technology company on a 9-year lock-in.",
    },
    {
        "id": "opp-pune-premium",
        "name": "Premium Commercial Asset",
        "location": "Kharadi, Pune",
        "asset_type": "Pre-Leased Office",
        "tenant": "Enterprise Occupier",
        "image": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=85",
        "min_investment": 2000000,
        "asset_value_cr": 55,
        "target_irr": 15.0,
        "target_irr_range": "14-16%",
        "rental_yield": 8.2,
        "lease_term_years": 8,
        "occupancy": 100,
        "tenure_years": 6,
        "funded_pct": 48,
        "leverage_available": False,
        "risk_score": 76,
        "tags": ["Pre-Leased", "Enterprise Tenant"],
        "highlight": "Stable enterprise occupier with strong covenants. Leverage availability under review.",
    },
    {
        "id": "opp-hyd-tower",
        "name": "Commercial Office Tower",
        "location": "Hitec City, Hyderabad",
        "asset_type": "A-Grade Office",
        "tenant": "Listed Corporate",
        "image": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=85",
        "min_investment": 2500000,
        "asset_value_cr": 120,
        "target_irr": 16.0,
        "target_irr_range": "15-17%",
        "rental_yield": 9.0,
        "lease_term_years": 9,
        "occupancy": 98,
        "tenure_years": 6,
        "funded_pct": 38,
        "leverage_available": True,
        "risk_score": 82,
        "tags": ["A-Grade", "Listed Tenant", "Leverage Available"],
        "highlight": "Largest asset on the platform; pre-leased to a listed Indian corporate with CPI escalations.",
    },
    {
        "id": "opp-ncr-business-park",
        "name": "Pre-leased Business Park",
        "location": "Gurugram, NCR",
        "asset_type": "Grade-A Office",
        "tenant": "MNC Occupier",
        "image": "https://images.unsplash.com/photo-1549757521-4160565ff3de?w=1200&q=85",
        "min_investment": 1500000,
        "asset_value_cr": 95,
        "target_irr": 15.0,
        "target_irr_range": "14-16%",
        "rental_yield": 8.7,
        "lease_term_years": 8,
        "occupancy": 100,
        "tenure_years": 6,
        "funded_pct": 71,
        "leverage_available": True,
        "risk_score": 80,
        "tags": ["MNC Tenant", "NCR", "Leverage Available"],
        "highlight": "100% leased to an MNC occupier in India's largest office market by absorption.",
    },
    {
        "id": "opp-bkc-skyline",
        "name": "BKC Skyline Towers",
        "location": "Bandra-Kurla Complex, Mumbai",
        "asset_type": "A-Grade Office",
        "tenant": "Global Tech MNC",
        "image": "https://images.unsplash.com/photo-1600531529272-023c4b821f14?w=1200&q=85",
        "min_investment": 2500000,
        "asset_value_cr": 142,
        "target_irr": 14.6,
        "target_irr_range": "14-15%",
        "rental_yield": 8.4,
        "lease_term_years": 9,
        "occupancy": 100,
        "tenure_years": 6,
        "funded_pct": 84,
        "leverage_available": True,
        "risk_score": 88,
        "tags": ["Pre-Leased", "Marquee", "Mumbai CBD"],
        "highlight": "Trophy BKC asset with 9-year lock-in to a global tech MNC.",
    },
    {
        "id": "opp-chen-marina",
        "name": "Marina Tech Square",
        "location": "OMR, Chennai",
        "asset_type": "IT Park",
        "tenant": "Insurance Captive",
        "image": "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&q=85",
        "min_investment": 800000,
        "asset_value_cr": 48,
        "target_irr": 15.8,
        "target_irr_range": "15-16%",
        "rental_yield": 9.0,
        "lease_term_years": 8,
        "occupancy": 94,
        "tenure_years": 6,
        "funded_pct": 33,
        "leverage_available": False,
        "risk_score": 72,
        "tags": ["Entry-Level", "Captive Tenant"],
        "highlight": "Lowest ticket size; ideal for first-time fractional investors.",
    },
    {
        "id": "opp-orr-prism",
        "name": "ORR Prism Business Park",
        "location": "Outer Ring Road, Bengaluru",
        "asset_type": "IT Park",
        "tenant": "Fortune 500 SaaS",
        "image": "https://images.unsplash.com/photo-1576731753569-3e93a228048c?w=1200&q=85",
        "min_investment": 1500000,
        "asset_value_cr": 88,
        "target_irr": 16.2,
        "target_irr_range": "15-17%",
        "rental_yield": 9.1,
        "lease_term_years": 7,
        "occupancy": 96,
        "tenure_years": 6,
        "funded_pct": 64,
        "leverage_available": True,
        "risk_score": 83,
        "tags": ["IT Park", "Anchor Tenant", "Leverage Available"],
        "highlight": "Bengaluru's tech corridor with 96% occupancy and CPI-linked rent escalations.",
    },
    {
        "id": "opp-leverage-alpha",
        "name": "Alpha Leverage Pool I",
        "location": "Pan-India Diversified",
        "asset_type": "Leveraged Fractional",
        "tenant": "Multiple Marquee Tenants",
        "image": "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=1200&q=85",
        "min_investment": 2000000,
        "asset_value_cr": 250,
        "target_irr": 17.0,
        "target_irr_range": "16-17%",
        "rental_yield": 8.8,
        "lease_term_years": 8,
        "occupancy": 99,
        "tenure_years": 6,
        "funded_pct": 18,
        "leverage_available": True,
        "risk_score": 79,
        "tags": ["Leverage Product", "Coming Soon", "Diversified"],
        "highlight": "Property Verse's flagship leverage-backed pool — up to 17% projected IRR through structured leverage.",
    },
]

@api_router.get("/opportunities")
async def list_opportunities(asset_type: Optional[str] = None, city: Optional[str] = None):
    items = SAMPLE_OPPORTUNITIES
    if asset_type and asset_type != "all":
        items = [o for o in items if o["asset_type"].lower() == asset_type.lower()]
    if city and city != "all":
        items = [o for o in items if city.lower() in o["location"].lower()]
    return {"items": items, "total": len(items)}

@api_router.get("/opportunities/{opp_id}")
async def get_opportunity(opp_id: str):
    for o in SAMPLE_OPPORTUNITIES:
        if o["id"] == opp_id:
            return o
    raise HTTPException(status_code=404, detail="Opportunity not found")

@api_router.get("/stats")
async def platform_stats():
    return {
        "aum_inr_cr": 1240,
        "investors": 18500,
        "properties": 47,
        "avg_irr": 15.8,
        "cities": 9,
        "occupancy_pct": 98,
    }

# ----------------- Lead Capture -----------------
@api_router.post("/waitlist")
async def join_waitlist(body: WaitlistRequest):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads_waitlist.insert_one(doc)
    return {"ok": True, "id": doc["id"]}

@api_router.post("/partner")
async def submit_partner(body: PartnerRequest):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads_partners.insert_one(doc)
    return {"ok": True, "id": doc["id"]}

@api_router.post("/strategy-call")
async def book_strategy_call(body: StrategyCallRequest):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads_strategy_calls.insert_one(doc)
    return {"ok": True, "id": doc["id"]}

# ----------------- Investor Dashboard -----------------
@api_router.get("/dashboard")
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

@api_router.post("/dashboard/watchlist")
async def add_watchlist(body: WatchlistRequest, user: dict = Depends(get_current_user)):
    if not any(o["id"] == body.opportunity_id for o in SAMPLE_OPPORTUNITIES):
        raise HTTPException(status_code=404, detail="Opportunity not found")
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$addToSet": {"watchlist": body.opportunity_id}},
    )
    return {"ok": True}

@api_router.delete("/dashboard/watchlist/{opp_id}")
async def remove_watchlist(opp_id: str, user: dict = Depends(get_current_user)):
    await db.users.update_one(
        {"_id": ObjectId(user["id"])},
        {"$pull": {"watchlist": opp_id}},
    )
    return {"ok": True}

# ----------------- Misc -----------------
@api_router.get("/")
async def root():
    return {"message": "Property Verse API", "status": "ok"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# ----------------- Startup Seeding -----------------
@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@propertyverse.in").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Property Verse Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "watchlist": [],
        })
    # Seed test investor
    test_email = os.environ.get("TEST_USER_EMAIL", "investor@propertyverse.in").lower()
    test_password = os.environ.get("TEST_USER_PASSWORD", "Investor2025!")
    existing_test = await db.users.find_one({"email": test_email})
    if not existing_test:
        await db.users.insert_one({
            "email": test_email,
            "password_hash": hash_password(test_password),
            "name": "Demo Investor",
            "role": "investor",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "watchlist": ["opp-blr-grade-a", "opp-leverage-alpha"],
        })
    else:
        # Refresh demo watchlist to current sample opportunity IDs
        valid_ids = {o["id"] for o in SAMPLE_OPPORTUNITIES}
        current = set(existing_test.get("watchlist", []))
        if not (current & valid_ids):
            await db.users.update_one(
                {"_id": existing_test["_id"]},
                {"$set": {"watchlist": ["opp-blr-grade-a", "opp-leverage-alpha"]}},
            )
    logger.info("Startup complete. Admin + test investor seeded.")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
