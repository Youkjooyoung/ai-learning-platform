# AI Learning Platform

## Summary

AI 학습/포트폴리오 관리 플랫폼.

## Stack

- Web: Next.js, React, TypeScript
- API: FastAPI
- Data: PostgreSQL, Redis
- Local: Docker Compose
- Cloud target: AWS

## MVP

- 회원가입, 로그인
- 학습노트 CRUD
- 태그
- 요약
- 질문 생성
- 대시보드

## Documents

- `docs/00_topic_rationale.md`
- `docs/01_requirements.md`
- `docs/02_analysis.md`
- `docs/03_design.md`
- `docs/04_implementation_plan.md`
- `docs/05_fastapi_intro.md`
- `docs/06_copy_guidelines.md`
- `docs/07_aws_deployment.md`

## Local

```powershell
docker compose -f infra/docker/compose.yml up --build
```

## Notes

- 원본 문서는 Git 저장소의 `docs/`에서 관리한다.
- Notion은 외부 공유용 요약 페이지로 사용한다.

