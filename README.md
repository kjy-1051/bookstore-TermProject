
# 📚 Bookstore API (FastAPI)

FastAPI 기반 백엔드 애플리케이션입니다.
JWT 기반 인증/인가(RBAC)를 사용하며, 도서·댓글·평점 관리 및 관리자 전용 API를 제공합니다.

## 🚀 주요 기능

회원가입 / 로그인 (JWT 인증)

도서 조회, 검색, 페이지네이션

댓글 및 평점 CRUD

관리자 전용 API

도서 / 유저 관리

통계 대시보드

헬스체크 API

Swagger(OpenAPI) 문서 제공

## 🌐 배포 정보

Base URL

http://113.198.66.68:10089

Swagger UI

http://113.198.66.68:10089/docs

Health Check

http://113.198.66.68:10089/health

postman URL

https://documenter.getpostman.com/view/48959912/2sB3dSRpFS

## 실행 방법

### 로컬 실행

- 가상환경 생성 및 활성화 (선택)

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

### 서버 실행 

- pm2 설치 (FastAPI 서버를 백그라운드로 실행하기 위한 프로세스 매니저)
  
sudo apt update

sudo apt install -y nodejs npm

sudo npm install -g pm2

- 프로젝트 다운로드
  
git clone https://github.com/kjy-1051/bookstore-backend.git

cd bookstore-backend

- 가상환경 활성화
  
source venv/bin/activate

- 의존성 설치
  
pip install -r requirements.txt

- DB 마이그레이션 및 시드 데이터
  
alembic upgrade head

python app/seed.py

- (선택) 기존 pm2 프로세스 제거
  
pm2 delete bookstore || true

- FastAPI 서버 실행 (pm2)
  
pm2 start ./venv/bin/uvicorn \
  --name bookstore \
  --interpreter python3 \
  -- app.main:app --host 0.0.0.0 --port 8080

- pm2 설정 저장
  
pm2 save

## 환경변수 설명 (.env.example)

DB_HOST = MySQL호스트

DB_PORT = MySQL포트

DB_USER = DB 사용자

DB_PASSWORD = DB 비밀번호

DB_NAME = DB 이름

JWT_SECRET = 서명용 비밀키

ACCESS_TOKEN_EXPIRE_MINUTES = 토큰 만료 시간

REDIS_HOST = Redis host 

REDIS_PORT = Redis host

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
  
- Redis 기반 토큰 관리 적용
  
- 통계 API 캐싱 최적화
  
- 관리자 대시보드 지표 확장

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
