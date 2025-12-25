# app/routers/auth_router.py
from fastapi import APIRouter, Depends, Query, Header
from sqlalchemy.orm import Session
from jose import JWTError

from app.core.database import get_db
from app.schemas.auth import LoginRequest, TokenResponseModel, TokenRefreshRequest
from app.core.security import get_current_user
from app.services.auth_service import login_user, refresh_access_token, logout_user
from app.core.config import settings

from app.exceptions.custom_exception import CustomException
from app.exceptions.error_codes import ErrorCode

from fastapi.responses import RedirectResponse
from app.services.auth_service import login_kakao
from app.services.auth_service import login_firebase_google

router = APIRouter(tags=["Auth"])


# =========================================================
# 📌 로그인
# =========================================================
@router.post("/login",
    response_model=TokenResponseModel,
    responses={
        200: {
            "description": "로그인 성공",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "xxxxx.yyyyy.zzzzz",
                        "refresh_token": "rrr.yyy.zzz",
                        "token_type": "bearer",
                        "role": "USER"
                    }
                }
            }
        },
        400: {
            "description": "필드 누락/잘못된 요청",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:00:00Z",
                        "path": "/auth/login",
                        "status": 400,
                        "code": "BAD_REQUEST",
                        "message": "이메일/비밀번호 형식 오류",
                        "details": {
                            "email": "required"
                        }
                    }
                }
            }
        },
        401: {
            "description": "로그인 실패 (비밀번호 틀림 or 계정 없음)",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:01:00Z",
                        "path": "/auth/login",
                        "status": 401,
                        "code": "UNAUTHORIZED",
                        "message": "이메일 또는 비밀번호가 올바르지 않습니다."
                    }
                }
            }
        },
        500: {
            "description": "서버 오류",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:01:40Z",
                        "path": "/auth/login",
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "로그인 처리 중 오류"
                    }
                }
            }
        }
    }
)
def login(request_data:LoginRequest, db:Session=Depends(get_db)):
    return login_user(db, request_data.email, request_data.password)


# =========================================================
# 📌 토큰 재발급
# =========================================================
@router.post("/refresh",
    response_model=TokenResponseModel,
    responses={
        200: {
            "description": "토큰 재발급 성공",
            "content": {
                "application/json": {
                    "example": {
                        "access_token": "newAccess.xxx.yyy",
                        "refresh_token": "newRefresh.aaa.bbb",
                        "token_type": "bearer",
                        "role": "USER"
                    }
                }
            }
        },
        401: {
            "description": "Refresh 토큰 만료/위조/없음",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:10:00Z",
                        "path": "/auth/refresh",
                        "status": 401,
                        "code": "TOKEN_EXPIRED",
                        "message": "Refresh Token expired or invalid"
                    }
                }
            }
        },
        422: {
            "description": "Refresh Token 형식 오류",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:10:20Z",
                        "path": "/auth/refresh",
                        "status": 422,
                        "code": "VALIDATION_FAILED",
                        "message": "Validation failed",
                        "details": [
                            {"field": "refresh_token", "msg": "required"}
                        ]
                    }
                }
            }
        },
        500: {
            "description": "서버 오류",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:10:30Z",
                        "path": "/auth/refresh",
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "토큰 재발급 처리 중 오류"
                    }
                }
            }
        }
    }
)
def refresh_token(request:TokenRefreshRequest):
    return refresh_access_token(request.refresh_token)


# =========================================================
# 📌 로그아웃
# =========================================================
@router.post("/logout",
    dependencies=[Depends(get_current_user)],
    responses={
        200: {
            "description": "로그아웃 성공",
            "content": {
                "application/json": {
                    "example": {
                        "message": "Logged out"
                    }
                }
            }
        },
        401: {
            "description": "토큰 없음 / 만료됨",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:20:00Z",
                        "path": "/auth/logout",
                        "status": 401,
                        "code": "UNAUTHORIZED",
                        "message": "로그인이 필요합니다.",
                        "details": None
                    }
                }
            }
        },
        500: {
            "description": "서버 오류",
            "content": {
                "application/json": {
                    "example": {
                        "timestamp": "2025-02-01T18:21:00Z",
                        "path": "/auth/logout",
                        "status": 500,
                        "code": "INTERNAL_SERVER_ERROR",
                        "message": "로그아웃 처리 중 오류"
                    }
                }
            }
        }
    },
    openapi_extra={"security":[{"BearerAuth": []}]}
)
def logout(current_user=Depends(get_current_user)):
    return logout_user(current_user["id"])

# =========================================================
# 📌 Kakao 소셜 로그인 - 로그인 시작
# =========================================================
@router.get("/oauth/kakao/login")
def kakao_login():
    kakao_auth_url = (
        "https://kauth.kakao.com/oauth/authorize"
        "?response_type=code"
        f"&client_id={settings.KAKAO_CLIENT_ID}"
        f"&redirect_uri={settings.KAKAO_REDIRECT_URI}"
    )
    return RedirectResponse(kakao_auth_url)


# =========================================================
# 📌 Kakao 소셜 로그인 - 콜백
# =========================================================
@router.get("/oauth/kakao/callback")
def kakao_callback(
    code: str = Query(...),
    db: Session = Depends(get_db)
):
    return login_kakao(db, code)


@router.post("/oauth/firebase/google", response_model=TokenResponseModel)
def firebase_google_login(
    authorization: str = Header(...),
    db: Session = Depends(get_db)
):
    # Authorization: Bearer <firebase_id_token>
    if not authorization.startswith("Bearer "):
        raise CustomException(
            401, ErrorCode.UNAUTHORIZED, "Authorization header invalid"
        )

    id_token = authorization.split(" ")[1]
    return login_firebase_google(db, id_token)
