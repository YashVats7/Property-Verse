"""Property Verse — main FastAPI entrypoint.
Modular routers live under /app/backend/app/routers/.
"""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging

from fastapi import APIRouter, FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.db import client, db
from app.ratelimit import limiter
from app.seed import seed_database
from app.routers import auth as auth_router
from app.routers import opportunities as opps_router
from app.routers import leads as leads_router
from app.routers import dashboard as dashboard_router
from app.routers import admin as admin_router
from app.routers import pdf as pdf_router

app = FastAPI(title="Property Verse API", docs_url=None, redoc_url=None, openapi_url=None)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root() -> dict:
    return {"message": "Property Verse API", "status": "ok"}


api_router.include_router(auth_router.router)
api_router.include_router(opps_router.router)
api_router.include_router(leads_router.router)
api_router.include_router(dashboard_router.router)
api_router.include_router(admin_router.router)
api_router.include_router(pdf_router.router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000")],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none'"
    return response


async def ensure_indexes() -> None:
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    await db.refresh_tokens.create_index("jti")
    await db.refresh_tokens.create_index("expires_at", expireAfterSeconds=0)
    await db.audit_log.create_index("created_at")


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup() -> None:
    await seed_database()
    await ensure_indexes()
    logger.info("Startup complete.")


@app.on_event("shutdown")
async def on_shutdown() -> None:
    client.close()
