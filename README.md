
# 📚 Bookstore API (FastAPI)
FastAPI 기반 백엔드 애플리케이션입니다.
JWT 기반 인증/인가(RBAC)를 사용하며, 도서·댓글·평점 관리 및 관리자 전용 API를 제공합니다.
본 프로젝트는 과제2를 바탕으로 한 백엔드 API중심 개인 과제로 설계되었으며,
Docker 기반 배포 및 Swagger / Postman을 통한 검증을 목표로 합니다.

🧩 프로젝트 개요

프로젝트 유형: 개인 Term Project

주제: 온라인 서점(Bookstore) API

핵심 목표:

JWT 인증/인가 및 RBAC 구현

소셜 로그인(Kakao, Firebase+Google) 구현

RDB + Redis 연동

Docker 기반 배포

Swagger / Postman 기반 API 검증

## 🚀 주요 기능

🔐 인증 / 인가

회원가입 / 로그인 (JWT)
Access Token / Refresh Token 분리 발급
Role 기반 인가(RBAC)
ROLE_USER
ROLE_ADMIN

🔐 소셜 로그인

Kakao OAuth2 로그인
Firebase Authentication 기반 Google 로그인

📚 도메인 기능

도서 조회 / 검색 / 페이지네이션
댓글 CRUD
평점 CRUD
관리자 전용 API
도서 관리
유저 관리
통계 대시보드

⚙️ 기타

헬스체크 API (GET /health)
입력값 검증 (Pydantic)
통일된 JSON 에러 응답
Swagger(OpenAPI) 자동 문서

## 🌐 배포 정보

본 프로젝트는 JCloud VM 환경에 Docker 기반으로 배포되었습니다.

⚠️ 접속 방식 안내 (중요)

JCloud 환경 특성상 외부에서 특정 포트로의 직접 접근이 제한되어 있습니다.
따라서 본 프로젝트는 서버 실행 후 SSH 포트 포워딩을 통해 API 서버에 접근하여 검증합니다.

아래 SSH 명령을 통해 서버 접속 및 포트 포워딩을 설정한 뒤,
로컬 환경에서 `localhost` 주소로 API에 접근할 수 있습니다.

▶️ 실행 방법 (Execution)

Docker / Docker Compose 설치 확인
docker --version
docker compose version

프로젝트 다운로드
git clone https://github.com/kjy-1051/bookstore-TermProject.git

프로젝트 루트 이동
cd bookstore-TermProject

환경변수 설정
.env.example 복사 후 .env에 실제 값 입력

Docker 이미지 빌드
docker compose build

컨테이너 실행
docker compose up -d

컨테이너 구성
MySQL 8.0
Redis 7
FastAPI Backend
(선택) Nginx + React Frontend

컨테이너 상태 확인
docker compose ps

시드 데이터 생성 (최초 1회)
docker compose exec backend python app/seed.py

🔐 SSH 포트 포워딩(필수)

ssh -i <KEY_FILE>.pem -p 19089 \
  -L 13089:localhost:13089 \
  -L 18089:localhost:18089 \
  ubuntu@113.198.66.68

localhost:13089 → FastAPI Backend
localhost:18089 → Frontend

### 🖥 Frontend 구현 관련 안내

본 프로젝트는 백엔드 API 중심 과제로 설계되었습니다.
React + Vite 기반 프론트엔드를 추가 구현하였으나,
JCloud 포트포워딩 및 Docker 네트워크 환경 특성상
외부 접속 환경에서 OAuth Redirect 및 API Proxy 경로가 안정적으로 연결되지 않는 문제가 확인되어 오류가 있을 수 있습니다.

### Backend API

- Base URL  
  http://localhost:13089

- Swagger UI  
  http://localhost:13089/docs

- Health Check  
  http://localhost:13089/health

- 포스트맨
  https://documenter.getpostman.com/view/48959912/2sB3dSRpFS
  
  * 소셜 로그인 테스트 안내
  
  소셜 로그인(Kakao, Google Firebase)의 경우  
  OAuth 특성상 브라우저 기반 Redirect가 필요합니다.
  
  본 프로젝트는 JCloud VM 환경에서
  SSH 포트 포워딩을 통해 접근하므로,
  Swagger UI 또는 Postman 환경에서
  OAuth Redirect 흐름을 완전하게 재현하기에는
  환경적 제약이 존재합니다.
  
  따라서 소셜 로그인 기능은
  브라우저 환경에서 테스트가 가능합니다.
  
  소셜 로그인 관련 모든 API 엔드포인트,
  토큰 발급 및 사용자 자동 가입 로직은
  정상적으로 구현되어 있습니다.

### 로컬 실행

- 가상환경 생성 및 활성화

python -m venv venv

source venv/bin/activate

- 의존성 설치
  
pip install -r requirements.txt

- DB 마이그레이션
  
alembic upgrade head

- 시드 데이터 생성
  
python app/seed.py

- 서버 실행
  
uvicorn app.main:app --host 0.0.0.0 --port 8080

Swagger UI: http://localhost:8080/docs
Health Check: http://localhost:8080/health

## 환경변수 설명 (.env.example)

실제 값은 .env 파일로 관리하며 Public Repo에는 포함하지 않습니다.

VITE_API_BASE_URL=
프론트엔드에서 접근할 Backend API Base URL
예: http://localhost:13089 (SSH 포트포워딩 환경)
예: http://localhost:8080 (로컬 개발 환경)

VITE_FIREBASE_API_KEY=
Firebase 프로젝트의 API Key (공개 키)

VITE_FIREBASE_AUTH_DOMAIN=
Firebase Authentication 도메인
예: your-project-id.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=
Firebase 프로젝트 ID

VITE_FIREBASE_APP_ID=
Firebase App ID (Web App용)

DB_HOST=
MySQL 호스트
Docker 환경: mysql
로컬 환경: localhost

DB_PORT=
MySQL 포트 (기본값: 3306)

DB_USER=
MySQL 사용자 계정

DB_PASSWORD=
MySQL 사용자 비밀번호

DB_NAME=
애플리케이션에서 사용할 데이터베이스 이름

JWT_SECRET=
JWT 서명용 비밀 키

ACCESS_TOKEN_EXPIRE_MINUTES=
Access Token 만료 시간 (분 단위)

REDIS_HOST=
Redis 호스트
Docker 환경: redis
로컬 환경: localhost

REDIS_PORT=
Redis 포트 (기본값: 6379)

KAKAO_CLIENT_ID=
Kakao REST API 키

KAKAO_CLIENT_SECRET=
Kakao Client Secret (선택 사항)

KAKAO_REDIRECT_URI=
Kakao OAuth Redirect URI
예: http://localhost:13089/auth/oauth/kakao/callback
예: http://localhost:8080/auth/oauth/kakao/callback

//Firebase Admin (Backend)

FIREBASE_CREDENTIALS_PATH=
Firebase Admin SDK 서비스 계정 JSON 파일 경로

CORS_ORIGINS=
허용할 Origin 목록 (콤마로 구분)
예: http://localhost:5173,http://localhost:18089

## 인증 플로우 설명

- /auth/login으로 로그인

- ACCESS TOKEN (JWT) 발급

- 이후 API 요청 시: Authorization: Bearer <AccessToken>

- Role 기반 인가(RBAC): ROLE_USER / ROLE_ADMIN

## 역할 / 권한

| API 경로        | USER | ADMIN |
|-----------------|:----:|:-----:|
| `/books`        |  O   |   O   |
| `/comments`     |  O   |   O   |
| `/ratings`      |  O   |   O   |
| `/admin/*`      |  X   |   O   |

## 예제 계정

- ADMIN: admin@example.com / admin1234

- USER: user1@test.com / 1234

## Database Configuration

- Database credentials are managed via `.env`
- Actual values are **excluded** from this public repository
- Access is restricted to an application-specific database

## 주요 엔드포인트

| Method | URL         | 설명         |
| ------ | ----------- | ----------  |
| POST   | /auth/login | 로그인        |
| GET    | /books      | 도서 목록 조회  |
| GET    | /books/{id} | 도서 상세 조회  |
| POST   | /comments   | 댓글 작성      |
| POST   | /ratings    | 평점 등록      |
| GET    | /health     | 헬스체크       |
| GET    | /docs       | Swagger UI   |


## 성능/보안 고려사항

- JWT 기반 인증 및 Role 기반 인가
  
- 입력값 검증 (Pydantic Schema)
  
- 페이지네이션 / 정렬 지원
  
- Redis 사용 가능 구조 (토큰/캐시 확장 고려)
  
- 관리자 API 분리 설계

## 한계 및 개선 계획

- Refresh Token 로테이션 고도화
  
- Redis 기반 캐싱 적용
  
- 통계 API 캐싱 최적화
  
- 관리자 대시보드 지표 확장


## ✅ 안내
 반드시 SSH 포트 포워딩 후 Swagger UI를 기준으로 실행하여야 합니다.
