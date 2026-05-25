# 09. 외부 연동 작업

## GitHub

현재 로컬 저장소에는 remote가 없다.

```powershell
git remote -v
```

GitHub CLI portable 경로:

```powershell
C:\tmp\gh-cli\bin\gh.exe --version
```

인증이 필요하다.

```powershell
C:\tmp\gh-cli\bin\gh.exe auth login --web --git-protocol https
```

인증 후 저장소 생성과 push:

```powershell
C:\tmp\gh-cli\bin\gh.exe repo create Youkjooyoung/ai-learning-platform --public --source . --remote origin --push
```

## Notion

현재 Notion 도구는 페이지 생성 시 `parent.page_id`가 필요하다.

필요 정보:

- Notion 부모 페이지 URL 또는 page ID

부모 페이지 ID를 확인한 뒤 `docs/notion_readme.md` 내용을 Notion 페이지로 생성한다.

## npm audit

확인일: 2026-05-25

- `npm view next version`: `16.2.6`
- 프로젝트 Next.js: `16.2.6`
- `npm audit --omit=dev`는 Next.js 내부 `postcss <8.5.10` 중간 등급 경고를 보고한다.
- `npm audit fix --force`는 Next.js를 9.x로 변경하려 하므로 적용하지 않는다.

