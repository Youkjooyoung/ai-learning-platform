import type { NoteStatus } from "@/lib/types";

const labels: Record<NoteStatus, string> = {
  draft: "초안",
  review: "복습",
  archived: "보관"
};

export function StatusPill({ status }: { status: NoteStatus }) {
  return <span className={`status status-${status}`}>{labels[status]}</span>;
}

