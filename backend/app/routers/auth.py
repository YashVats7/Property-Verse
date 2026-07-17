"""Auth endpoints: register, login, logout, me, refresh (with rotation + revocation)."""
from datetime import datetime, timezone, timedelta
from typing import Optional

import jwt as pyjwt
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, Field

from ..db import db
from ..ratelimit import limiter, client_ip
from ..security import (
    JWT_ALGORITHM, _jwt_secret, hash_password, verify_password,
    create_access_token, issue_refresh_token, revoke_refresh_token, is_refresh_token_valid,
    set_auth_cookies, clear_auth_cookies, get_current_user, validate_password_strength,
)

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(max_length=128)
    website: Optional[str] = None  # honeypot


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(max_length=128)


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str = "investor"


@router.post("/register", response_model=UserOut)
@limiter.limit("5/minute")
async def register(body: RegisterRequest, request: Request, response: Response):
    if body.website:
        raise HTTPException(status_code=400, detail="Invalid submission")
    validate_password_strength(body.password)
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
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
    set_auth_cookies(response, create_access_token(uid, email), await issue_refresh_token(uid))
    return UserOut(id=uid, name=doc["name"], email=email, role="investor")


@router.post("/login", response_model=UserOut)
@limiter.limit("10/minute")
async def login(body: LoginRequest, request: Request, response: Response):
    email = body.email.lower().strip()
    identifier = f"{client_ip(request)}:{email}"
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
    set_auth_cookies(response, create_access_token(uid, email), await issue_refresh_token(uid))
    return UserOut(id=uid, name=user.get("name", ""), email=email, role=user.get("role", "investor"))


@router.post("/logout")
async def logout(request: Request, response: Response):
    rt = request.cookies.get("refresh_token")
    if rt:
        try:
            payload = pyjwt.decode(rt, _jwt_secret(), algorithms=[JWT_ALGORITHM], options={"verify_exp": False})
            if payload.get("jti"):
                await revoke_refresh_token(payload["jti"])
        except pyjwt.PyJWTError:
            pass
    clear_auth_cookies(response)
    return {"ok": True}


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(id=user["id"], name=user.get("name", ""), email=user["email"], role=user.get("role", "investor"))


@router.post("/refresh")
@limiter.limit("30/minute")
async def refresh_token(request: Request, response: Response):
    rt = request.cookies.get("refresh_token")
    if not rt:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = pyjwt.decode(rt, _jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        jti = payload.get("jti")
        if jti and not await is_refresh_token_valid(jti):
            raise HTTPException(status_code=401, detail="Refresh token revoked")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        # Rotation: revoke old token, issue a fresh pair
        if jti:
            await revoke_refresh_token(jti)
        uid = str(user["_id"])
        set_auth_cookies(response, create_access_token(uid, user["email"]), await issue_refresh_token(uid))
        return {"ok": True}
    except pyjwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
