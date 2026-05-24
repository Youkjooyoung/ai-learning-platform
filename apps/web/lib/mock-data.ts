import type { DashboardStat, LearningNote } from "./types";

export const initialNotes: LearningNote[] = [
  {
    id: 1,
    title: "FastAPI",
    content: "라우터, 스키마, 의존성 주입, OpenAPI 문서를 확인했다.",
    status: "review",
    tags: ["backend", "api"],
    updatedAt: "2026-05-24"
  },
  {
    id: 2,
    title: "Docker Compose",
    content: "api, web, postgres, redis 서비스를 하나의 compose 파일로 묶는다.",
    status: "draft",
    tags: ["infra"],
    updatedAt: "2026-05-24"
  },
  {
    id: 3,
    title: "Next.js",
    content: "App Router 기준으로 화면과 컴포넌트 구조를 정리한다.",
    status: "draft",
    tags: ["frontend"],
    updatedAt: "2026-05-23"
  }
];

export const stats: DashboardStat[] = [
  { label: "노트", value: "3" },
  { label: "태그", value: "4" },
  { label: "요약", value: "1" }
];

