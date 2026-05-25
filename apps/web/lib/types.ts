export type NoteStatus = "draft" | "review" | "archived";

export type LearningNote = {
  id: number;
  title: string;
  content: string;
  status: NoteStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type DashboardStat = {
  label: string;
  value: string;
};

export type AiOutput = {
  id: number;
  noteId: number;
  outputType: "summary" | "questions";
  provider: string;
  content: string;
  createdAt: string;
};

export type DashboardSummary = {
  totalNotes: number;
  totalTags: number;
  aiOutputs: number;
  recentNotes: LearningNote[];
};
