# app/services/auth_service.py
from sqlalchemy.orm import Session
from jose import jwt, JWTError

from app.models.user import User
from app.core.redis import r
from app.core.security import verify_password, create_access_token, create_refresh_token
from app.core.config import settings

from app.exceptions.custom_exception import CustomException
from app.exceptions.error_codes import ErrorCode
import requests
from firebase_admin import auth as firebase_auth
import logging

logger = logging.getLogger(__name__)

# =========================================================
# 📌 로그인
# =========================================================
def login_user(db: Session, email: str, password: str):
    try:
        user = db.query(User).filter(User.email == email).first()

        if not user or not verify_password(password, user.hashed_password):
            raise CustomException(
                status=401,
                code=ErrorCode.UNAUTHORIZED,
                message="이메일 또는 비밀번호가 올바르지 않습니다."
            )

        if user.status != "ACTIVE":
            raise CustomException(
                status=403,
                code=ErrorCode.FORBIDDEN,
                message="비활성화되었거나 차단된 계정입니다."
            )

        access = create_access_token({"sub": str(user.id), "role": user.role})
        refresh = create_refresh_token({"sub": str(user.id), "role": user.role})

        r.set(f"user:{user.id}:refresh", refresh, ex=60*60*24*7)

        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "role": user.role
        }

    except CustomException:
        raise
    except Exception:
        raise CustomException(
            status=500,
            code=ErrorCode.INTERNAL_SERVER_ERROR,
            message="로그인 처리 중 오류"
        )



# =========================================================
# 📌 토큰 재발급
# =========================================================
def refresh_access_token(refresh_token: str):
    try:
        payload = jwt.decode(refresh_token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
        role = payload.get("role")

        if not user_id:
            raise CustomException(
                status=401,
                code=ErrorCode.UNAUTHORIZED,
                message="올바르지 않은 Refresh Token 입니다."
            )

        stored = r.get(f"user:{user_id}:refresh")

        if not stored or stored != refresh_token:
            raise CustomException(
                status=401,
                code=ErrorCode.TOKEN_EXPIRED,
                message="Refresh Token expired or invalid"
            )

        new_access = create_access_token({"sub": str(user_id), "role": role})
        new_refresh = create_refresh_token({"sub": str(user_id), "role": role})

        r.set(f"user:{user_id}:refresh", new_refresh, ex=60*60*24*7)

        return {
            "access_token": new_access,
            "refresh_token": new_refresh,
            "token_type": "bearer",
            "role": role
        }

    except JWTError:
        raise CustomException(
            status=401,
            code=ErrorCode.TOKEN_EXPIRED,
            message="Refresh Token expired or invalid"
        )


# =========================================================
# 📌 로그아웃
# =========================================================
def logout_user(user_id: int):
    deleted = r.delete(f"user:{user_id}:refresh")

    return {
        "message": "Logged out successfully" if deleted else "Already logged out or token not found"
    }

# =========================================================
# 📌 Kakao 소셜 로그인
# =========================================================
def login_kakao(db: Session, code: str):
    try:
        # 1️⃣ Authorization Code → Access Token
        token_res = requests.post(
            "https://kauth.kakao.com/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": settings.KAKAO_CLIENT_ID,
                "redirect_uri": settings.KAKAO_REDIRECT_URI,
                "code": code,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

        if token_res.status_code != 200:
            raise CustomException(
                401, ErrorCode.UNAUTHORIZED, "Kakao token 발급 실패"
            )

        access_token = token_res.json().get("access_token")

        # 2️⃣ Kakao 사용자 정보 조회
        user_res = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        kakao_user = user_res.json()
        kakao_id = kakao_user.get("id")
        kakao_account = kakao_user.get("kakao_account", {})
        email = kakao_account.get("email")
        profile = kakao_account.get("profile", {})
        name = profile.get("nickname", "KakaoUser")

        if not kakao_id:
            raise CustomException(
                401, ErrorCode.UNAUTHORIZED, "Kakao 사용자 정보 조회 실패"
            )

        # 3️⃣ 기존 유저 조회 or 생성
        user = db.query(User).filter(
            User.provider == "KAKAO",
            User.provider_id == str(kakao_id)
        ).first()

        if not user:
            user = User(
                email=email or f"kakao_{kakao_id}@example.com",
                hashed_password="SOCIAL_LOGIN",
                name=name,
                role="USER",
                status="ACTIVE",
                provider="KAKAO",
                provider_id=str(kakao_id)
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # 4️⃣ 기존 JWT 로직 재사용
        access = create_access_token({"sub": str(user.id), "role": user.role})
        refresh = create_refresh_token({"sub": str(user.id), "role": user.role})

        r.set(f"user:{user.id}:refresh", refresh, ex=60 * 60 * 24 * 7)

        if token_res.status_code != 200:
            print("KAKAO TOKEN ERROR:", token_res.status_code, token_res.text)
            raise CustomException(
                401, ErrorCode.UNAUTHORIZED, "Kakao token 발급 실패"
            )


        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "role": user.role
        }

    except CustomException:
        raise
    except Exception as e:
        raise CustomException(
            500,
            ErrorCode.INTERNAL_SERVER_ERROR,
            "Kakao 로그인 처리 중 오류",
            details=str(e)
        )
    

def login_firebase_google(db: Session, id_token: str):
    try:
        # 1️⃣ Firebase ID Token 검증
        decoded = firebase_auth.verify_id_token(id_token)

        uid = decoded.get("uid")
        email = decoded.get("email")
        name = decoded.get("name", "GoogleUser")

        if not uid:
            raise CustomException(
                401, ErrorCode.UNAUTHORIZED, "Invalid Firebase token"
            )

        # 2️⃣ 유저 조회 or 생성
        user = db.query(User).filter(
            User.provider == "FIREBASE",
            User.provider_id == uid
        ).first()

        if not user:
            user = User(
                email=email or f"firebase_{uid}@example.com",
                hashed_password="SOCIAL_LOGIN",
                name=name,
                role="USER",
                status="ACTIVE",
                provider="FIREBASE",
                provider_id=uid
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        # 3️⃣ 기존 JWT 로직 재사용
        access = create_access_token({"sub": str(user.id), "role": user.role})
        refresh = create_refresh_token({"sub": str(user.id), "role": user.role})

        r.set(f"user:{user.id}:refresh", refresh, ex=60 * 60 * 24 * 7)

        return {
            "access_token": access,
            "refresh_token": refresh,
            "token_type": "bearer",
            "role": user.role
        }

    except firebase_auth.InvalidIdTokenError:
        raise CustomException(
            401, ErrorCode.UNAUTHORIZED, "Firebase token invalid"
        )
    except Exception as e:
        logger.error("Firebase login failed", exc_info=True)
        raise CustomException(
            500,
            ErrorCode.INTERNAL_SERVER_ERROR,
            "Firebase 로그인 처리 중 오류",
            details={"error": str(e)}
        )
