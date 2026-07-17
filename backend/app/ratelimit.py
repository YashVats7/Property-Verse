"""Per-IP rate limiting (slowapi), proxy-aware behind Kubernetes ingress."""
from fastapi import Request
from slowapi import Limiter


def client_ip(request: Request) -> str:
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


limiter = Limiter(key_func=client_ip)
