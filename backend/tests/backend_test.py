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

DEMO_EMAIL = os.environ["TEST_USER_EMAIL"]
DEMO_PASSWORD = os.environ["TEST_USER_PASSWORD"]
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]

SAMPLE_IDS = [
    "opp-blr-grade-a", "opp-pune-premium", "opp-hyd-tower", "opp-ncr-business-park",
    "opp-bkc-skyline", "opp-chen-marina", "opp-orr-prism", "opp-leverage-alpha",
]

REQUIRED_FIELDS = ["leverage_available", "asset_value_cr", "target_irr_range", "risk_score"]


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def client() -> requests.Session:
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def demo_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    assert r.status_code == 200, f"Demo login failed: {r.status_code} {r.text}"
    return s


# ---------- Health / Root ----------
def test_root(client) -> None:
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


# ---------- Opportunities ----------
def test_list_opportunities_total(client) -> None:
    r = client.get(f"{API}/opportunities")
    assert r.status_code == 200
    assert r.json()["total"] == 8


def test_list_opportunities_ids(client) -> None:
    r = client.get(f"{API}/opportunities")
    assert r.status_code == 200
    ids = {o["id"] for o in r.json()["items"]}
    assert ids == set(SAMPLE_IDS)


def test_list_opportunities_required_fields(client) -> None:
    r = client.get(f"{API}/opportunities")
    assert r.status_code == 200
    for o in r.json()["items"]:
        assert "name" in o and "image" in o and "target_irr" in o
        for f in REQUIRED_FIELDS:
            assert f in o, f"Missing field {f} in {o['id']}"


def test_opportunity_detail_for_all_ids(client) -> None:
    for oid in SAMPLE_IDS:
        r = client.get(f"{API}/opportunities/{oid}")
        assert r.status_code == 200, f"{oid} returned {r.status_code}"
        d = r.json()
        assert d["id"] == oid
        for f in REQUIRED_FIELDS:
            assert f in d


def test_list_opportunities_filter_city(client) -> None:
    r = client.get(f"{API}/opportunities", params={"city": "Mumbai"})
    assert r.status_code == 200
    data = r.json()
    assert data["total"] >= 1
    for o in data["items"]:
        assert "mumbai" in o["location"].lower()


def test_get_opportunity_detail(client) -> None:
    r = client.get(f"{API}/opportunities/opp-bkc-skyline")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "opp-bkc-skyline"
    assert data["target_irr"] > 0


# ---------- Logout idempotency ----------
def test_logout_idempotent_no_auth(client) -> None:
    """Logout should work even without auth cookies."""
    s = requests.Session()
    r = s.post(f"{API}/auth/logout")
    assert r.status_code == 200
    assert r.json().get("ok") == True  # noqa: E712


# ---------- Demo investor watchlist migration ----------
def test_demo_watchlist_contains_valid_new_ids(demo_session) -> None:
    r = demo_session.get(f"{API}/dashboard")
    assert r.status_code == 200
    data = r.json()
    valid_ids = set(SAMPLE_IDS)
    wl_ids = {o["id"] for o in data["watchlist"]}
    assert len(wl_ids) >= 1, "Demo watchlist should not be empty after migration"
    assert wl_ids.issubset(valid_ids), f"Watchlist contains invalid IDs: {wl_ids - valid_ids}"


def test_get_opportunity_not_found(client) -> None:
    r = client.get(f"{API}/opportunities/does-not-exist")
    assert r.status_code == 404


# ---------- Stats ----------
def test_stats(client) -> None:
    r = client.get(f"{API}/stats")
    assert r.status_code == 200
    data = r.json()
    for k in ("aum_inr_cr", "investors", "properties", "avg_irr", "cities", "occupancy_pct"):
        assert k in data


# ---------- Lead Capture ----------
def test_waitlist(client) -> None:
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
    assert body["ok"] == True and "id" in body  # noqa: E712


def test_partner(client) -> None:
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
    assert r.json()["ok"] == True  # noqa: E712


def test_strategy_call(client) -> None:
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
    assert r.json()["ok"] == True  # noqa: E712


# ---------- Auth ----------
def test_demo_login_and_me() -> None:
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


def test_admin_login() -> None:
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    assert r.json()["role"] == "admin"


def test_login_invalid_credentials(client) -> None:
    r = client.post(f"{API}/auth/login", json={"email": "noone@example.com", "password": "wrong"})
    assert r.status_code in (401, 429)


def test_me_unauthenticated(client) -> None:
    s = requests.Session()
    r = s.get(f"{API}/auth/me")
    assert r.status_code == 401


def test_register_and_logout() -> None:
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
def test_dashboard_requires_auth(client) -> None:
    s = requests.Session()
    r = s.get(f"{API}/dashboard")
    assert r.status_code == 401


def test_dashboard_loads_demo(demo_session) -> None:
    r = demo_session.get(f"{API}/dashboard")
    assert r.status_code == 200, r.text
    data = r.json()
    assert "watchlist" in data and "recommended" in data
    assert len(data["recommended"]) == 3
    # Watchlist may have been modified by prior test runs; ensure it's a list
    assert isinstance(data["watchlist"], list)


def test_dashboard_watchlist_crud() -> None:
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


# ---------- Admin Endpoints ----------
@pytest.fixture(scope="module")
def admin_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    assert r.json().get("role") == "admin"
    return s


def test_admin_stats(admin_session) -> None:
    r = admin_session.get(f"{API}/admin/stats")
    assert r.status_code == 200, r.text
    data = r.json()
    for k in ("waitlist", "partners", "strategy_calls", "users", "investors"):
        assert k in data
        assert isinstance(data[k], int)


def test_admin_waitlist_list(admin_session) -> None:
    r = admin_session.get(f"{API}/admin/leads/waitlist")
    assert r.status_code == 200
    data = r.json()
    assert "items" in data and isinstance(data["items"], list)


def test_admin_partners_list(admin_session) -> None:
    r = admin_session.get(f"{API}/admin/leads/partners")
    assert r.status_code == 200
    assert isinstance(r.json().get("items"), list)


def test_admin_strategy_calls_list(admin_session) -> None:
    r = admin_session.get(f"{API}/admin/leads/strategy-calls")
    assert r.status_code == 200
    assert isinstance(r.json().get("items"), list)


def test_admin_users_list_no_password_hash(admin_session) -> None:
    r = admin_session.get(f"{API}/admin/users")
    assert r.status_code == 200
    items = r.json().get("items")
    assert isinstance(items, list)
    assert len(items) >= 2
    for u in items:
        assert "password_hash" not in u, "password_hash leaked in /admin/users response"
        assert "_id" not in u
        assert "id" in u
        assert "email" in u


def test_admin_delete_waitlist_lead(admin_session, client) -> None:
    # Create a waitlist lead first
    email = f"TEST_admin_del_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "name": "TEST_AdminDelete",
        "email": email,
        "phone": "+918888888888",
        "investment_range": "25L-1Cr",
        "source": "investor_waitlist",
    }
    r = client.post(f"{API}/waitlist", json=payload)
    assert r.status_code == 200
    lead_id = r.json().get("id")
    assert lead_id

    # Confirm it's listed
    lst = admin_session.get(f"{API}/admin/leads/waitlist?limit=500").json()["items"]
    found = next((x for x in lst if x.get("email") == email), None)
    assert found is not None, "Newly created waitlist lead not visible to admin"

    # Delete (use returned id which may be uuid string OR mongo _id)
    target_id = found.get("id", lead_id)
    r = admin_session.delete(f"{API}/admin/leads/waitlist/{target_id}")
    assert r.status_code == 200
    assert r.json().get("ok") in (True, False)  # True for mongo _id path

    # Verify gone
    lst2 = admin_session.get(f"{API}/admin/leads/waitlist?limit=500").json()["items"]
    found2 = next((x for x in lst2 if x.get("email") == email), None)
    assert found2 is None, "Waitlist lead still present after delete"


def test_admin_delete_unknown_collection(admin_session) -> None:
    r = admin_session.delete(f"{API}/admin/leads/unknown-coll/abc123")
    assert r.status_code == 400


# ---------- Admin auth guard ----------
def test_admin_endpoints_require_auth() -> None:
    s = requests.Session()
    for path in ["/admin/stats", "/admin/leads/waitlist", "/admin/leads/partners",
                 "/admin/leads/strategy-calls", "/admin/users"]:
        r = s.get(f"{API}{path}")
        assert r.status_code == 401, f"{path} should be 401 unauth, got {r.status_code}"


def test_admin_endpoints_forbid_investor(demo_session) -> None:
    for path in ["/admin/stats", "/admin/leads/waitlist", "/admin/leads/partners",
                 "/admin/leads/strategy-calls", "/admin/users"]:
        r = demo_session.get(f"{API}{path}")
        assert r.status_code == 403, f"{path} should be 403 for investor, got {r.status_code}"


# ---------- Demo investor watchlist forced alignment ----------
def test_demo_watchlist_forced_alignment(demo_session) -> None:
    """v3: demo investor watchlist should be FORCED to opp-blr-grade-a + opp-leverage-alpha on startup."""
    r = demo_session.get(f"{API}/dashboard")
    assert r.status_code == 200
    wl_ids = {o["id"] for o in r.json()["watchlist"]}
    # Note: this test runs after test_dashboard_watchlist_crud which uses a different user,
    # so demo watchlist should still match the seeded values
    assert wl_ids == {"opp-blr-grade-a", "opp-leverage-alpha"}, (
        f"Demo watchlist mismatch: {wl_ids}"
    )


# ---------- Static asset presence ----------
def test_generated_assets_present(client) -> None:
    for oid in SAMPLE_IDS:
        url = f"{BASE_URL}/generated/assets/{oid}.png"
        r = client.head(url, allow_redirects=True)
        assert r.status_code == 200, f"{url} returned {r.status_code}"
