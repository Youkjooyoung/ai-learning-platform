import type { AiOutput, DashboardSummary, LearningNote, NoteStatus } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ApiNote = {
  id: number;
  title: string;
  content: string;
  status: NoteStatus;
  tags: string[];
  created_at: string;
  updated_at: string;
};

type ApiAiOutput = {
  id: number;
  note_id: number;
  output_type: "summary" | "questions";
  provider: string;
  content: string;
  created_at: string;
};

type ApiDashboardSummary = {
  total_notes: number;
  total_tags: number;
  ai_outputs: number;
  recent_notes: ApiNote[];
};

export type NotePayload = {
  title: string;
  content: string;
  status: NoteStatus;
  tags: string[];
};

function toNote(note: ApiNote): LearningNote {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    status: note.status,
    tags: note.tags,
    createdAt: note.created_at,
    updatedAt: note.updated_at
  };
}

function toAiOutput(output: ApiAiOutput): AiOutput {
  return {
    id: output.id,
    noteId: output.note_id,
    outputType: output.output_type,
    provider: output.provider,
    content: output.content,
    createdAt: output.created_at
  };
}

async function request<T>(path: string, init: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function register(email: string, password: string) {
  return request<{ id: number; email: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function login(email: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", email);
  body.set("password", password);

  return request<{ access_token: string; token_type: string }>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
}

export async function me(token: string) {
  return request<{ id: number; email: string }>("/auth/me", {}, token);
}

export async function listNotes(token: string, query = "") {
  const search = query ? `?q=${encodeURIComponent(query)}` : "";
  const notes = await request<ApiNote[]>(`/notes${search}`, {}, token);
  return notes.map(toNote);
}

export async function createNote(token: string, payload: NotePayload) {
  const note = await request<ApiNote>(
    "/notes",
    {
      method: "POST",
      body: JSON.stringify(payload)
    },
    token
  );
  return toNote(note);
}

export async function updateNote(token: string, id: number, payload: Partial<NotePayload>) {
  const note = await request<ApiNote>(
    `/notes/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload)
    },
    token
  );
  return toNote(note);
}

export async function deleteNote(token: string, id: number) {
  await request<void>(`/notes/${id}`, { method: "DELETE" }, token);
}

export async function summarizeNote(token: string, id: number) {
  const output = await request<ApiAiOutput>(`/notes/${id}/summarize`, { method: "POST" }, token);
  return toAiOutput(output);
}

export async function createQuestions(token: string, id: number) {
  const output = await request<ApiAiOutput>(`/notes/${id}/questions`, { method: "POST" }, token);
  return toAiOutput(output);
}

export async function dashboardSummary(token: string): Promise<DashboardSummary> {
  const summary = await request<ApiDashboardSummary>("/dashboard/summary", {}, token);
  return {
    totalNotes: summary.total_notes,
    totalTags: summary.total_tags,
    aiOutputs: summary.ai_outputs,
    recentNotes: summary.recent_notes.map(toNote)
  };
}
