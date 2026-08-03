"""CORS preflight tests for production-domain fix (iteration 8).

Must be executed against localhost:8001 directly, because the preview ingress
injects a permissive `access-control-allow-origin: *` header on the public URL
which would mask backend misconfigurations.
"""
import pytest
import requests

LOCAL = "http://localhost:8001"

ALLOWED_ORIGINS = [
    "https://propertyverse.co.in",
    "https://www.propertyverse.co.in",
    "https://propverse-invest.emergent.host",
    "https://propverse-invest.preview.emergentagent.com",
]

BLOCKED_ORIGINS = [
    "https://evil.example.com",
    "http://attacker.local",
]


def _preflight(origin: str):
    return requests.options(
        f"{LOCAL}/api/auth/login",
        headers={
            "Origin": origin,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
        timeout=10,
    )


@pytest.mark.parametrize("origin", ALLOWED_ORIGINS)
def test_cors_preflight_allowed(origin):
    r = _preflight(origin)
    assert r.status_code in (200, 204), f"preflight status {r.status_code} for {origin}"
    aco = r.headers.get("access-control-allow-origin")
    assert aco == origin, f"expected ACAO={origin}, got {aco!r} (headers={dict(r.headers)})"
    assert r.headers.get("access-control-allow-credentials", "").lower() == "true"


@pytest.mark.parametrize("origin", BLOCKED_ORIGINS)
def test_cors_preflight_blocked(origin):
    r = _preflight(origin)
    aco = r.headers.get("access-control-allow-origin")
    assert aco != origin, f"disallowed origin {origin} was echoed back: {aco!r}"
    # Starlette CORS returns 400 or omits ACAO for disallowed origins
    assert aco in (None, ""), f"expected no ACAO for blocked origin, got {aco!r}"


def test_cors_regex_subdomain_variants():
    # extra subdomain patterns covered by allow_origin_regex
    for origin in [
        "https://foo.propertyverse.co.in",
        "https://bar.baz.emergent.host",
        "https://something.emergentagent.com",
    ]:
        r = _preflight(origin)
        assert r.headers.get("access-control-allow-origin") == origin, (
            f"regex origin {origin} not allowed; got {r.headers.get('access-control-allow-origin')!r}"
        )
