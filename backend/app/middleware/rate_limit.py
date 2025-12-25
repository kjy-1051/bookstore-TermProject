# app/middleware/rate_limit.py
import os
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.redis import r


RATE_LIMIT = int(os.getenv("RATE_LIMIT", 60))          # 요청 수
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", 60))  # 초


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 🔥 프록시 고려 IP 추출
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            ip = forwarded.split(",")[0].strip()
        else:
            ip = request.client.host

        key = f"rate:{ip}"

        count = r.incr(key)

        if count == 1:
            r.expire(key, RATE_LIMIT_WINDOW)

        if count > RATE_LIMIT:
            raise HTTPException(
                status_code=429,
                detail="Too many requests"
            )

        return await call_next(request)
