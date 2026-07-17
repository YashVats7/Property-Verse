"""Authentication helpers: password hashing, JWT, cookies, current-user dep."""
import os
import re
import uuid
from datetime import datetime, timezone, timedelta

import bcrypt
import jwt as pyjwt
from bson import ObjectId
from fastapi import HTTPException, Request, Response

from .db import db

JWT_ALGORITHM = "HS256"


def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="Password must contain at least one letter and one number")


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


async def issue_refresh_token(user_id: str) -> str:
    """Create a refresh token with a server-tracked jti (revocable, rotatable)."""
    jti = uuid.uuid4().hex
    expires = datetime.now(timezone.utc) + timedelta(days=7)
    payload = {"sub": user_id, "exp": expires, "type": "refresh", "jti": jti}
    await db.refresh_tokens.insert_one({
        "jti": jti,
        "user_id": user_id,
        "expires_at": expires,
        "revoked": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return pyjwt.encode(payload, _jwt_secret(), algorithm=JWT_ALGORITHM)


async def revoke_refresh_token(jti: str):
    await db.refresh_tokens.update_one({"jti": jti}, {"$set": {"revoked": True}})


async def is_refresh_token_valid(jti: str) -> bool:
    doc = await db.refresh_tokens.find_one({"jti": jti})
    return bool(doc) and not doc.get("revoked", False)


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


async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user
