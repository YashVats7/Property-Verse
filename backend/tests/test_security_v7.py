"""V7 security hardening tests: rate limits, security headers, password policy,
magic-byte image validation, honeypot, refresh rotation+revocation, audit log."""
import os
import uuid
import time
import struct
import zlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://propverse-invest.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"
LOCAL_API = "http://localhost:8001/api"

ADMIN_EMAIL = "admin@propertyverse.in"
ADMIN_PASSWORD = "PropVerseAdmin2025!"
INV_EMAIL = "investor@propertyverse.in"
INV_PASSWORD = "Investor2025!"


def _tiny_png() -> bytes:
    # Minimal valid 1x1 PNG
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = b"IHDR" + struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    ihdr_chunk = struct.pack(">I", 13) + ihdr + struct.pack(">I", zlib.crc32(ihdr) & 0xFFFFFFFF)
    raw = b"\x00\xff\xff\xff"
    comp = zlib.compress(raw)
    idat = b"IDAT" + comp
    idat_chunk = struct.pack(">I", len(comp)) + idat + struct.pack(">I", zlib.crc32(idat) & 0xFFFFFFFF)
    iend = b"IEND"
    iend_chunk = struct.pack(">I", 0) + iend + struct.pack(">I", zlib.crc32(iend) & 0xFFFFFFFF)
    return sig + ihdr_chunk + idat_chunk + iend_chunk


@pytest.fixture(scope="module")
def admin_session():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


# ------------- Security headers -------------
def test_security_headers_present():
    r = requests.get(f"{API}/")
    assert r.status_code == 200
    h = {k.lower(): v for k, v in r.headers.items()}
    assert "strict-transport-security" in h
    assert h.get("x-frame-options", "").upper() == "DENY"
    assert h.get("x-content-type-options", "").lower() == "nosniff"
    assert "content-security-policy" in h
    assert "referrer-policy" in h


# ------------- Docs disabled -------------
def test_openapi_disabled():
    r = requests.get(f"{API}/openapi.json")
    assert r.status_code == 404


# ------------- Password policy -------------
def test_register_weak_password_too_short():
    email = f"t_{uuid.uuid4().hex[:10]}@example.com"
    r = requests.post(f"{API}/auth/register", json={"name": "T", "email": email, "password": "abc"})
    assert r.status_code == 400
    assert "at least 8" in r.json().get("detail", "").lower()


def test_register_weak_password_letters_only():
    email = f"t_{uuid.uuid4().hex[:10]}@example.com"
    r = requests.post(f"{API}/auth/register", json={"name": "T", "email": email, "password": "abcdefgh"})
    assert r.status_code == 400
    assert "letter" in r.json().get("detail", "").lower() or "number" in r.json().get("detail", "").lower()


def test_register_strong_password_ok():
    email = f"t_{uuid.uuid4().hex[:10]}@example.com"
    r = requests.post(f"{API}/auth/register", json={"name": "T", "email": email, "password": "SecurePass123"})
    assert r.status_code == 200, r.text
    assert r.json()["email"] == email


# ------------- Honeypot -------------
def test_waitlist_honeypot_silently_discarded(admin_session):
    before = admin_session.get(f"{API}/admin/leads/waitlist?limit=500").json()["items"]
    before_count = len(before)
    email = f"honey_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API}/waitlist", json={
        "name": "Bot", "email": email, "phone": "+911111111111",
        "investment_range": "1Cr+", "source": "investor_waitlist",
        "website": "http://spam.com",
    })
    assert r.status_code == 200
    assert r.json().get("ok") is True
    after = admin_session.get(f"{API}/admin/leads/waitlist?limit=500").json()["items"]
    # Ensure the honeypot email is NOT persisted
    assert not any(x.get("email") == email for x in after)
    # And overall count did not increase for this email
    assert len(after) == before_count


# ------------- Refresh token rotation + revocation -------------
def test_refresh_rotation_revokes_old_token():
    s = requests.Session()
    email = f"rot_{uuid.uuid4().hex[:8]}@example.com"
    r = s.post(f"{API}/auth/register", json={"name": "Rot", "email": email, "password": "SecurePass123"})
    assert r.status_code == 200
    old_rt = s.cookies.get("refresh_token")
    assert old_rt

    # First refresh with old cookie
    r2 = s.post(f"{API}/auth/refresh")
    assert r2.status_code == 200, r2.text
    new_rt = s.cookies.get("refresh_token")
    assert new_rt and new_rt != old_rt

    # Replay OLD refresh token -> must be rejected
    s2 = requests.Session()
    s2.cookies.set("refresh_token", old_rt)
    r3 = s2.post(f"{API}/auth/refresh")
    assert r3.status_code == 401
    assert "revoked" in r3.json().get("detail", "").lower()


def test_logout_revokes_refresh_token():
    s = requests.Session()
    email = f"lo_{uuid.uuid4().hex[:8]}@example.com"
    r = s.post(f"{API}/auth/register", json={"name": "Lo", "email": email, "password": "SecurePass123"})
    assert r.status_code == 200
    rt = s.cookies.get("refresh_token")
    assert rt
    # Logout
    r2 = s.post(f"{API}/auth/logout")
    assert r2.status_code == 200
    # Old refresh token must not work
    s2 = requests.Session()
    s2.cookies.set("refresh_token", rt)
    r3 = s2.post(f"{API}/auth/refresh")
    assert r3.status_code == 401


# ------------- Admin image upload magic-byte validation -------------
def test_upload_rejects_text_as_png(admin_session):
    files = {"file": ("fake.png", b"NOT A REAL PNG just plain text bytes", "image/png")}
    r = admin_session.post(f"{API}/admin/upload", files=files)
    assert r.status_code == 400
    assert "image" in r.json().get("detail", "").lower()


def test_upload_accepts_real_png_and_audits(admin_session):
    before = admin_session.get(f"{API}/admin/audit-log?limit=10").json()["items"]
    before_upload_count = sum(1 for x in before if x.get("action") == "upload_image")

    files = {"file": ("good.png", _tiny_png(), "image/png")}
    r = admin_session.post(f"{API}/admin/upload", files=files)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["url"].startswith("/uploads/") and body["url"].endswith(".png")

    # Audit log recorded
    after = admin_session.get(f"{API}/admin/audit-log?limit=10").json()["items"]
    after_upload_count = sum(1 for x in after if x.get("action") == "upload_image")
    assert after_upload_count == before_upload_count + 1


# ------------- Audit log endpoint -------------
def test_audit_log_endpoint(admin_session):
    r = admin_session.get(f"{API}/admin/audit-log?limit=50")
    assert r.status_code == 200
    items = r.json()["items"]
    assert isinstance(items, list)
    if items:
        rec = items[0]
        for k in ("action", "admin_email", "target", "created_at"):
            assert k in rec


def test_audit_log_forbidden_for_investor():
    s = requests.Session()
    r = s.post(f"{API}/auth/login", json={"email": INV_EMAIL, "password": INV_PASSWORD})
    assert r.status_code == 200
    r2 = s.get(f"{API}/admin/audit-log")
    assert r2.status_code == 403


# ------------- PDF gen still works -------------
def test_pdf_generation_still_works():
    r = requests.post(
        f"{API}/opportunities/opp-bkc-skyline/pdf",
        json={"name": "T PDF", "email": f"pdf_{uuid.uuid4().hex[:6]}@example.com"},
    )
    assert r.status_code == 200, r.text
    assert r.headers.get("content-type", "").startswith("application/pdf")
    assert r.content[:4] == b"%PDF"


# ------------- Rate limiting via localhost + spoofed XFF (run LAST) -------------
def test_zzz_waitlist_rate_limit_429():
    """Test rate limits via localhost with spoofed XFF so shared public state is not polluted."""
    ip = f"198.51.100.{50 + (int(time.time()) % 40)}"
    headers = {"X-Forwarded-For": ip, "Content-Type": "application/json"}
    got_429 = False
    for i in range(14):
        r = requests.post(f"{LOCAL_API}/waitlist", headers=headers, json={
            "name": f"RL{i}", "email": f"rl_{i}_{uuid.uuid4().hex[:4]}@example.com",
            "phone": "+911234567890", "investment_range": "25L-1Cr",
            "source": "investor_waitlist",
        })
        if r.status_code == 429:
            got_429 = True
            break
    assert got_429, "Expected 429 within 14 requests on /waitlist (limit 10/min)"


def test_zzz_register_rate_limit_429():
    ip = f"198.51.100.{100 + (int(time.time()) % 40)}"
    headers = {"X-Forwarded-For": ip, "Content-Type": "application/json"}
    got_429 = False
    for i in range(9):
        r = requests.post(f"{LOCAL_API}/auth/register", headers=headers, json={
            "name": "RL", "email": f"reg_{i}_{uuid.uuid4().hex[:6]}@example.com",
            "password": "SecurePass123",
        })
        if r.status_code == 429:
            got_429 = True
            break
    assert got_429, "Expected 429 within 9 requests on /auth/register (limit 5/min)"


def test_zzz_login_rate_limit_429():
    ip = f"198.51.100.{150 + (int(time.time()) % 40)}"
    headers = {"X-Forwarded-For": ip, "Content-Type": "application/json"}
    got_429 = False
    for i in range(14):
        # Use throwaway emails so we don't trigger brute-force lock on real accounts
        r = requests.post(f"{LOCAL_API}/auth/login", headers=headers, json={
            "email": f"throwaway_{i}_{uuid.uuid4().hex[:6]}@example.com",
            "password": "wrong",
        })
        if r.status_code == 429:
            got_429 = True
            break
    assert got_429, "Expected 429 within 14 requests on /auth/login (limit 10/min)"
