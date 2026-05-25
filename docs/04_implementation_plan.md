# 04. 구현계획서

## Phase 1. Project Base

- 모노레포 구조 생성
- 공통 README, gitignore, Docker Compose 작성
- 문서 0~6단계 작성

## Phase 2. API

- FastAPI 앱 생성
- 설정, DB 세션, 모델, 스키마 작성
- 인증 API 작성
- 노트 CRUD 작성
- AI mock provider 작성
- 대시보드 API 작성
- pytest 기반 API 테스트 작성

## Phase 3. Web

- Next.js App Router 구조 작성
- 작업도구형 대시보드 화면 작성
- API client와 타입 작성
- 설명형 문구 제거

## Phase 4. Local Runtime

- API Dockerfile 작성
- Web Dockerfile 작성
- PostgreSQL, Redis 포함 Docker Compose 작성
- 환경변수 예시 작성

## Phase 5. Verification

- API 테스트
- Web 빌드
- Docker Compose 구동
- 불필요한 타 도구 흔적 검색
- GitHub 레포 생성 및 push
- Notion README 페이지 작성

## Current Status

- 완료: 문서 0~7단계, FastAPI API, Next.js UI, 실제 API 연결, Docker Compose 설정, CI 초안, smoke script.
- 보류: GitHub 원격 저장소 생성 및 push. 현재 환경에는 `gh`가 없고 GitHub 커넥터에 새 저장소 생성 도구가 없다.
- 보류: Notion 페이지 생성. 현재 Notion 커넥터는 `parent` 페이지 ID를 필수로 요구한다.
