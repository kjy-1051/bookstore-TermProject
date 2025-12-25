from sqlalchemy import Column, Integer, String, Enum, DateTime
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class RoleEnum(str, enum.Enum):
    USER = "USER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    name = Column(String(50), nullable=False)              # 이름
    phone = Column(String(20), nullable=True)              # 전화번호
    address = Column(String(255), nullable=True)           # 기본 배송주소

    role = Column(Enum(RoleEnum), default=RoleEnum.USER, nullable=False)
    status = Column(String(20), default="ACTIVE")          # 탈퇴/정지 대비

    # ✅ 소셜 로그인 식별자 (추가)
    provider = Column(String(20), nullable=False, default="LOCAL") # LOCAL / KAKAO / GOOGLE
    provider_id = Column(String(100), nullable=True) # 각 provider 고유 id

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

