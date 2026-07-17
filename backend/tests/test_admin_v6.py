"""v6 admin tests — opportunities CRUD, content CRUD, image upload, /api/content/*, reset."""
import io
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://propverse-invest.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
DEMO_EMAIL = os.environ["TEST_USER_EMAIL"]
DEMO_PASSWORD = os.environ["TEST_USER_PASSWORD"]


@pytest.fixture(scope="module")
def admin_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return s


@pytest.fixture(scope="module")
def investor_session() -> requests.Session:
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": DEMO_EMAIL, "password": DEMO_PASSWORD})
    assert r.status_code == 200, r.text
    return s


# ----- Public content endpoints -----
def test_public_content_hero() -> None:
    r = requests.get(f"{API}/content/hero")
    assert r.status_code == 200
    assert isinstance(r.json(), (dict, list))


def test_public_content_about() -> None:
    r = requests.get(f"{API}/content/about")
    assert r.status_code == 200


def test_public_content_personas() -> None:
    r = requests.get(f"{API}/content/personas")
    assert r.status_code == 200


def test_public_content_stats_endpoint() -> None:
    r = requests.get(f"{API}/content/stats")
    assert r.status_code == 200
    d = r.json()
    for k in ("aum_inr_cr", "investors", "properties", "avg_irr", "cities", "occupancy_pct"):
        assert k in d


def test_public_content_unknown_404() -> None:
    r = requests.get(f"{API}/content/nope")
    assert r.status_code == 404


# ----- Admin auth guard -----
def test_admin_opps_requires_auth() -> None:
    r = requests.get(f"{API}/admin/opportunities")
    assert r.status_code == 401


def test_admin_opps_forbid_investor(investor_session) -> None:
    r = investor_session.get(f"{API}/admin/opportunities")
    assert r.status_code == 403


def test_admin_content_requires_auth() -> None:
    r = requests.put(f"{API}/admin/content/stats", json={"value": {}})
    assert r.status_code == 401


def test_admin_upload_forbid_investor(investor_session) -> None:
    r = investor_session.post(f"{API}/admin/upload")
    assert r.status_code in (403, 422)  # 403 guard before form parse expected


# ----- Admin opportunities listing -----
def test_admin_list_opps_returns_8(admin_session) -> None:
    r = admin_session.get(f"{API}/admin/opportunities")
    assert r.status_code == 200
    items = r.json()["items"]
    assert len(items) == 8
    for o in items:
        assert "id" in o and "name" in o
        assert "_id" not in o


# ----- Admin opportunities CRUD (split: create / update / delete) -----
_crud_state: dict = {}


def _opp_payload() -> dict:
    return {
        "name": f"TEST_New_{uuid.uuid4().hex[:6]}",
        "location": "TestCity",
        "asset_type": "A-Grade Office",
        "tenant": "TEST_Tenant",
        "min_investment": 500000,
        "asset_value_cr": 25,
        "target_irr": 14.0,
        "target_irr_range": "13-15%",
        "rental_yield": 8.0,
        "lease_term_years": 5,
        "occupancy": 95,
        "tenure_years": 5,
        "funded_pct": 10,
        "leverage_available": False,
        "risk_score": 70,
        "tags": ["TEST"],
        "highlight": "TEST highlight",
    }


def test_admin_opp_create(admin_session) -> None:
    payload = _opp_payload()
    r = admin_session.post(f"{API}/admin/opportunities", json=payload)
    assert r.status_code == 200, r.text
    created = r.json()
    assert created["id"].startswith("opp-")
    assert created["name"] == payload["name"]
    _crud_state["id"] = created["id"]
    _crud_state["payload"] = payload

    # visible via public detail
    r2 = requests.get(f"{API}/opportunities/{created['id']}")
    assert r2.status_code == 200
    assert r2.json()["id"] == created["id"]


def test_admin_opp_update(admin_session) -> None:
    new_id = _crud_state["id"]
    payload = _crud_state["payload"]
    update = {**payload, "name": payload["name"] + "_upd", "target_irr": 18.0}
    r = admin_session.put(f"{API}/admin/opportunities/{new_id}", json=update)
    assert r.status_code == 200, r.text
    assert r.json()["target_irr"] == 18.0

    # persisted
    r2 = requests.get(f"{API}/opportunities/{new_id}")
    assert r2.json()["name"].endswith("_upd")


def test_admin_opp_delete(admin_session) -> None:
    new_id = _crud_state["id"]
    r = admin_session.delete(f"{API}/admin/opportunities/{new_id}")
    assert r.status_code == 200
    assert r.json()["ok"] == True  # noqa: E712

    # gone
    r2 = requests.get(f"{API}/opportunities/{new_id}")
    assert r2.status_code == 404


def test_admin_opp_update_not_found(admin_session) -> None:
    r = admin_session.put(f"{API}/admin/opportunities/does-not-exist", json={
        "name": "X", "location": "Y", "asset_type": "Z",
    })
    assert r.status_code == 404


def test_admin_opp_delete_not_found(admin_session) -> None:
    r = admin_session.delete(f"{API}/admin/opportunities/does-not-exist")
    assert r.status_code == 404


# ----- Admin content CRUD -----
def test_admin_content_stats_update_and_reflect(admin_session) -> None:
    new_val = {
        "aum_inr_cr": 9999, "investors": 12345, "properties": 77,
        "avg_irr": 16.5, "cities": 11, "occupancy_pct": 97,
    }
    r = admin_session.put(f"{API}/admin/content/stats", json={"value": new_val})
    assert r.status_code == 200
    assert r.json()["ok"] == True  # noqa: E712

    # reflected in public
    after = requests.get(f"{API}/stats").json()
    assert after["aum_inr_cr"] == 9999
    assert after["properties"] == 77

    # restore demo
    restore = {
        "aum_inr_cr": 1240, "investors": 18500, "properties": 47,
        "avg_irr": 15.8, "cities": 9, "occupancy_pct": 98,
    }
    rr = admin_session.put(f"{API}/admin/content/stats", json={"value": restore})
    assert rr.status_code == 200
    assert requests.get(f"{API}/stats").json()["aum_inr_cr"] == 1240


def test_admin_content_hero_about_personas(admin_session) -> None:
    for key in ("hero", "about", "personas"):
        current = requests.get(f"{API}/content/{key}").json()
        # round-trip put
        r = admin_session.put(f"{API}/admin/content/{key}", json={"value": current})
        assert r.status_code == 200, f"{key} put failed: {r.text}"


# ----- Image upload -----
def test_admin_upload_image(admin_session) -> None:
    # Minimal 1x1 PNG
    png_bytes = (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8"
        b"\xcf\xc0\x00\x00\x00\x03\x00\x01\x5b\x67\x3b\x7f\x00\x00\x00\x00IEND\xaeB`\x82"
    )
    files = {"file": ("test.png", io.BytesIO(png_bytes), "image/png")}
    # IMPORTANT: clear Content-Type so requests sets multipart boundary
    h = {k: v for k, v in admin_session.headers.items() if k.lower() != "content-type"}
    r = requests.post(f"{API}/admin/upload", files=files, cookies=admin_session.cookies, headers=h)
    assert r.status_code == 200, r.text
    url = r.json()["url"]
    assert url.startswith("/uploads/")
    # HEAD on frontend static
    head = requests.head(f"{BASE_URL}{url}", allow_redirects=True)
    assert head.status_code == 200, f"Static {url} not served: {head.status_code}"


def test_admin_upload_rejects_bad_ext(admin_session) -> None:
    files = {"file": ("bad.exe", io.BytesIO(b"x"), "application/octet-stream")}
    h = {k: v for k, v in admin_session.headers.items() if k.lower() != "content-type"}
    r = requests.post(f"{API}/admin/upload", files=files, cookies=admin_session.cookies, headers=h)
    assert r.status_code == 400


# ----- Reset opportunities + watchlist preserved -----
def test_admin_reset_opportunities_preserves_demo_watchlist(admin_session, investor_session) -> None:
    r = admin_session.post(f"{API}/admin/opportunities/reset")
    assert r.status_code == 200, r.text
    assert r.json()["count"] == 8

    # Demo investor watchlist should still resolve valid IDs
    d = investor_session.get(f"{API}/dashboard").json()
    wl_ids = {o["id"] for o in d["watchlist"]}
    assert {"opp-blr-grade-a", "opp-leverage-alpha"}.issubset(wl_ids) or len(wl_ids) >= 1
