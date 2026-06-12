"""
Backend API tests for Property Verse.
Covers: opportunities, stats, lead capture, auth (register/login/me/logout),
dashboard CRUD on watchlist. Uses public REACT_APP_BACKEND_URL.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://propverse-invest.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

DEMO_EMAIL = "investor@propertyverse.in"
DEMO_PASSWORD = "Investor2025!"
ADMIN_EMAIL = "admin@propertyverse.in"
ADMIN_PASSWORD = "PropVerseAdmin2025!"

SAMPLE_IDS = [
    "opp-blr-grade-a", "opp-pune-premium", "opp-hyd-tower", "opp-ncr-business-park",
    "opp-bkc-skyline", "opp-chen-marina", "opp-orr-prism", "opp-leverage-alpha",
]

REQUIRED_FIELDS = ["leverage_available", "asset_value_cr", "target_irr_range", "risk_score"]


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def demo_session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    assert r.status_code == 200, f"Demo login failed: {r.status_code} {r.text}"
    return s


# ---------- Health / Root ----------
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ---------- Opportunities ----------
def test_list_opportunities(client):
    r = client.get(f"{API}/opportunities")
    assert r.status_code == 200
    data = r.json()
    assert data["total"] == 8
    ids = {o["id"] for o in data["items"]}
    assert ids == set(SAMPLE_IDS)
    for o in data["items"]:
        assert "name" in o and "image" in o and "target_irr" in o
        for f in REQUIRED_FIELDS:
            assert f in o, f"Missing field {f} in {o['id']}"


def test_opportunity_detail_for_all_ids(client):
    for oid in SAMPLE_IDS:
        r = client.get(f"{API}/opportunities/{oid}")
        assert r.status_code == 200, f"{oid} returned {r.status_code}"
        d = r.json()
        assert d["id"] == oid
        for f in REQUIRED_FIELDS:
            assert f in d


def test_list_opportunities_filter_city(client):
    r = client.get(f"{API}/opportunities", params={"city": "Mumbai"})
    assert r.status_code == 200
    data = r.json()
    assert data["total"] >= 1
    for o in data["items"]:
        assert "mumbai" in o["location"].lower()


def test_get_opportunity_detail(client):
    r = client.get(f"{API}/opportunities/opp-bkc-skyline")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "opp-bkc-skyline"
    assert data["target_irr"] > 0


# ---------- Logout idempotency ----------
def test_logout_idempotent_no_auth(client):
    """Logout should work even without auth cookies."""
    s = requests.Session()
    r = s.post(f"{API}/auth/logout")
    assert r.status_code == 200
    assert r.json().get("ok") is True


# ---------- Demo investor watchlist migration ----------
def test_demo_watchlist_contains_valid_new_ids(demo_session):
    r = demo_session.get(f"{API}/dashboard")
    assert r.status_code == 200
    data = r.json()
    valid_ids = set(SAMPLE_IDS)
    wl_ids = {o["id"] for o in data["watchlist"]}
    assert len(wl_ids) >= 1, "Demo watchlist should not be empty after migration"
    assert wl_ids.issubset(valid_ids), f"Watchlist contains invalid IDs: {wl_ids - valid_ids}"


def test_get_opportunity_not_found(client):
    r = client.get(f"{API}/opportunities/does-not-exist")
    assert r.status_code == 404


# ---------- Stats ----------
def test_stats(client):
    r = client.get(f"{API}/stats")
    assert r.status_code == 200
    data = r.json()
    for k in ("aum_inr_cr", "investors", "properties", "avg_irr", "cities", "occupancy_pct"):
        assert k in data


# ---------- Lead Capture ----------
def test_waitlist(client):
    payload = {
        "name": "TEST_Investor",
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "phone": "+919999999999",
        "investment_range": "25L-1Cr",
        "source": "investor_waitlist",
    }
    r = client.post(f"{API}/waitlist", json=payload)
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True and "id" in body


def test_partner(client):
    payload = {
        "name": "TEST_Partner",
        "email": f"partner_{uuid.uuid4().hex[:8]}@example.com",
        "company": "TestCo",
        "role": "Director",
        "partnership_type": "bank_nbfc",
        "message": "Interested in lending rails.",
    }
    r = client.post(f"{API}/partner", json=payload)
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_strategy_call(client):
    payload = {
        "name": "TEST_Caller",
        "email": f"call_{uuid.uuid4().hex[:8]}@example.com",
        "phone": "+911234567890",
        "preferred_time": "Tomorrow 4pm",
        "investment_size": "50L",
        "notes": "Looking at BKC Skyline.",
    }
    r = client.post(f"{API}/strategy-call", json=payload)
    assert r.status_code == 200
    assert r.json()["ok"] is True


# ---------- Auth ----------
def test_demo_login_and_me():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    assert r.status_code == 200, r.text
    user = r.json()
    assert user["email"] == DEMO_EMAIL
    # cookie set
    assert "access_token" in s.cookies.get_dict()

    r2 = s.get(f"{API}/auth/me")
    assert r2.status_code == 200
    assert r2.json()["email"] == DEMO_EMAIL


def test_admin_login():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    assert r.json()["role"] == "admin"


def test_login_invalid_credentials(client):
    r = client.post(f"{API}/auth/login", json={"email": "noone@example.com", "password": "wrong"})
    assert r.status_code in (401, 429)


def test_me_unauthenticated(client):
    s = requests.Session()
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_register_and_logout():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"test_signup_{uuid.uuid4().hex[:8]}@example.com"
    r = s.post(f"{API}/auth/register", json={"name": "Test Signup", "email": email, "password": "TestPass123!"})
    assert r.status_code == 200, r.text
    assert r.json()["email"] == email
    assert "access_token" in s.cookies.get_dict()

    r2 = s.get(f"{API}/auth/me")
    assert r2.status_code == 200

    # duplicate email rejected
    r3 = s.post(f"{API}/auth/register", json={"name": "Dup", "email": email, "password": "TestPass123!"})
    assert r3.status_code == 400

    r4 = s.post(f"{API}/auth/logout")
    assert r4.status_code == 200

    # session cleared
    s2 = requests.Session()
    r5 = s2.get(f"{API}/auth/me")
    assert r5.status_code == 401


# ---------- Dashboard ----------
def test_dashboard_requires_auth(client):
    s = requests.Session()
    r = s.get(f"{API}/dashboard")
    assert r.status_code == 401


def test_dashboard_loads_demo(demo_session):
    r = demo_session.get(f"{API}/dashboard")
    assert r.status_code == 200, r.text
    data = r.json()
    assert "watchlist" in data and "recommended" in data
    assert len(data["recommended"]) == 3
    # Watchlist may have been modified by prior test runs; ensure it's a list
    assert isinstance(data["watchlist"], list)


def test_dashboard_watchlist_crud():
    # Use fresh signup to get clean watchlist
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"test_wl_{uuid.uuid4().hex[:8]}@example.com"
    r = s.post(f"{API}/auth/register", json={"name": "WL Tester", "email": email, "password": "TestPass123!"})
    assert r.status_code == 200

    # Initially empty
    d = s.get(f"{API}/dashboard").json()
    assert d["watchlist"] == []

    # Add
    r = s.post(f"{API}/dashboard/watchlist", json={"opportunity_id": "opp-bkc-skyline"})
    assert r.status_code == 200

    # Verify added
    d2 = s.get(f"{API}/dashboard").json()
    ids = {o["id"] for o in d2["watchlist"]}
    assert "opp-bkc-skyline" in ids

    # Add invalid
    bad = s.post(f"{API}/dashboard/watchlist", json={"opportunity_id": "opp-nonexistent"})
    assert bad.status_code == 404

    # Remove
    r = s.delete(f"{API}/dashboard/watchlist/opp-bkc-skyline")
    assert r.status_code == 200

    # Verify removed
    d3 = s.get(f"{API}/dashboard").json()
    ids2 = {o["id"] for o in d3["watchlist"]}
    assert "opp-bkc-skyline" not in ids2
