export type NoteStatus = "draft" | "review" | "archived";

export type LearningNote = {
  id: number;
  title: string;
  content: string;
  status: NoteStatus;
  tags: string[];
  updatedAt: string;
};

export type DashboardStat = {
  label: string;
  value: string;
};

