# 00. 주제 선정 사유서

## 선택 주제

`AI 학습/포트폴리오 관리 플랫폼`

## 선택 이유

- 개인 학습 기록, 구현 결과, 회고를 하나의 서비스 흐름으로 다룰 수 있다.
- FastAPI, Next.js, PostgreSQL, Redis, Docker, AWS를 한 프로젝트 안에서 자연스럽게 사용할 수 있다.
- AI 요약과 질문 생성은 학습노트라는 도메인에 직접 연결되므로 기능의 이유가 분명하다.
- GitHub 저장소, Figma 화면 설계, Notion 소개 페이지와 연결하기 쉽다.

## 후보 비교

| 후보 | 장점 | 제외 또는 보류 이유 |
| --- | --- | --- |
| AI 학습/포트폴리오 관리 플랫폼 | 문서, API, UI, AI 기능, 배포를 모두 보여주기 좋음 | MVP 범위 관리가 필요함 |
| 실시간 자산 대시보드 | 차트와 외부 API 경험을 보여주기 좋음 | 금융 데이터의 정확성, API 제한, 실시간 비용 이슈가 있음 |
| 업무/이슈 트래커 | 협업, 권한, 댓글, 알림 설계에 적합함 | 기존 서비스와 차별점 설명이 약할 수 있음 |
| 예약/결제 플랫폼 | 실무 도메인 설계가 분명함 | 결제 연동은 정책과 보안 검토가 필요함 |
| 개발자 커뮤니티 | CRUD, 검색, 댓글, 태그 구현에 적합함 | AI 기능이 핵심 가치가 되기 어려움 |

## 사실과 가정

- 사실: FastAPI 공식 문서는 Python 타입 힌트와 Pydantic 기반 검증, OpenAPI 문서 자동 생성을 주요 특징으로 설명한다.
- 사실: Docker Compose 공식 문서는 여러 서비스를 하나의 YAML 파일로 정의하고 실행하는 도구라고 설명한다.
- 가정: 이 프로젝트는 취업 포트폴리오에서 백엔드, 프론트엔드, 문서화, 배포 흐름을 함께 보여주는 목적이다.

## Sources

- FastAPI Features: https://fastapi.tiangolo.com/features/
- Docker Compose Docs: https://docs.docker.com/compose/
- Stack Overflow Developer Survey 2025: https://survey.stackoverflow.co/2025/technology

