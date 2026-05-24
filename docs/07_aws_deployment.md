# 07. AWS 배포 메모

## 초기 목표

초기 배포는 EC2 한 대에서 Docker Compose로 실행한다. 이 방식은 개인 포트폴리오의 첫 배포 범위로 둔다.

## 구성

- EC2: web, api, postgres, redis 컨테이너 실행
- Security Group: 22, 80, 443만 외부 노출
- 도메인과 HTTPS는 배포 단계에서 Route 53 또는 외부 DNS, reverse proxy를 선택한다.

## 고도화 후보

- PostgreSQL: RDS 분리
- Redis: ElastiCache 분리
- 정적 자산: S3와 CloudFront 검토
- CI/CD: GitHub Actions에서 SSH 또는 배포 스크립트 실행

## 주의

- 운영 DB 비밀번호와 JWT secret은 `.env`에만 둔다.
- API 키는 GitHub, Notion, 로그에 노출하지 않는다.
- 비용이 발생하는 리소스는 생성 전 확인한다.

