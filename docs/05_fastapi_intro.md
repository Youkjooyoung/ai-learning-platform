# 05. FastAPI 설명

## FastAPI란

FastAPI는 Python으로 API 서버를 만들기 위한 웹 프레임워크다. 공식 문서는 Python 타입 힌트와 Pydantic을 기반으로 데이터 검증과 OpenAPI 문서 생성을 지원한다고 설명한다.

## 이 프로젝트에서 쓰는 이유

- 요청과 응답 스키마를 코드에 명확히 표현할 수 있다.
- `/docs`에서 API를 바로 확인할 수 있다.
- AI 요약, 질문 생성처럼 Python 생태계와 연결되는 기능을 다루기 쉽다.
- MVP에서는 mock provider로 시작하고 실제 AI provider는 환경변수로 전환한다.

## Spring Boot와의 차이

- FastAPI는 Python 타입 힌트와 Pydantic 기반 API 작성 흐름이 강점이다.
- Spring Boot는 Java/Kotlin 생태계, 대규모 엔터프라이즈 구조, Spring Security/JPA 같은 생태계가 강점이다.
- 이 프로젝트는 AI 기능을 빠르게 붙이는 개인 포트폴리오라는 가정에 맞춰 FastAPI를 선택한다.

## 주의점

- `async`는 외부 API나 DB 드라이버가 비동기일 때 의미가 있다.
- 실제 AI API는 비용과 지연이 있으므로 mock provider를 기본값으로 둔다.
- 운영 배포 전에는 인증, CORS, rate limit, 로그, 오류 응답 정책을 추가 검토해야 한다.

## Sources

- FastAPI Features: https://fastapi.tiangolo.com/features/
- FastAPI SQL Databases: https://fastapi.tiangolo.com/tutorial/sql-databases/
- OpenAI Text Generation: https://platform.openai.com/docs/guides/text

