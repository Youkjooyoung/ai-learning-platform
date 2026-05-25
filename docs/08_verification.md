# 08. 검증 기록

## Local Checks

- `npm --workspace apps/web run typecheck`
- `npm --workspace apps/web run build`
- `python -m pytest`
- `python -m ruff check .`
- `docker compose -f infra/docker/compose.yml config`
- `docker compose -f infra/docker/compose.yml build web`
- `docker compose -f infra/docker/compose.yml build api`

## Smoke

- Web: `http://127.0.0.1:3000`
- API health: `http://127.0.0.1:8000/health`
- Live API: `scripts/smoke-api.ps1`

## Notes

- UI 문구는 기능 라벨 중심으로 유지한다.
- 외부 API 키는 저장소에 커밋하지 않는다.
- GitHub push와 Notion 페이지 생성은 외부 권한/대상 정보가 필요하다.
- `npm audit --omit=dev`는 Next.js 내부 `postcss <8.5.10` 중간 등급 경고를 보고한다. `npm audit fix --force`가 Next 9.x로 변경하려 하므로 자동 수정하지 않는다.
