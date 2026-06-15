"""Property Verse — main FastAPI entrypoint.
Modular routers live under /app/backend/app/routers/.
"""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging

from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.db import client
from app.seed import seed_database
from app.routers import auth as auth_router
from app.routers import opportunities as opps_router
from app.routers import leads as leads_router
from app.routers import dashboard as dashboard_router
from app.routers import admin as admin_router
from app.routers import pdf as pdf_router

app = FastAPI(title="Property Verse API")
api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
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

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    await seed_database()
    logger.info("Startup complete.")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()
