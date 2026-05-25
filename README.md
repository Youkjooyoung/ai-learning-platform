# AI Learning Platform

AI 학습/포트폴리오 관리 플랫폼입니다. 원본 문서는 `docs/`에서 관리하고, Notion에는 README 형식 요약 페이지를 별도로 작성합니다.

## Stack

- Web: Next.js, React, TypeScript
- API: FastAPI, SQLAlchemy, Pydantic
- Data: PostgreSQL, Redis
- Local runtime: Docker Compose
- Cloud target: AWS EC2 중심, RDS/ElastiCache는 배포 고도화 단계

## Local Run

```powershell
docker compose -f infra/docker/compose.yml up --build
```

- Web: http://localhost:3000
- API: http://localhost:8000
- API docs: http://localhost:8000/docs

## Development

```powershell
npm install
npm run dev:web
```

```powershell
cd apps/api
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -e .[dev]
uvicorn app.main:app --reload
```

## Verification

```powershell
npm --workspace apps/web run typecheck
npm --workspace apps/web run build
```

```powershell
cd apps/api
python -m pytest
python -m ruff check .
```

Live API smoke test:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/smoke-api.ps1
```

## Documents

- [주제 선정 사유](docs/00_topic_rationale.md)
- [요구사항정의서](docs/01_requirements.md)
- [분석서](docs/02_analysis.md)
- [설계서](docs/03_design.md)
- [구현계획서](docs/04_implementation_plan.md)
- [FastAPI 설명](docs/05_fastapi_intro.md)
- [UI 문구 기준](docs/06_copy_guidelines.md)
- [검증 기록](docs/08_verification.md)
- [외부 연동 작업](docs/09_external_setup.md)
