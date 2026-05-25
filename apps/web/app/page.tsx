"use client";

import { FileText, LogOut, Plus, Save, Search, Sparkles, Trash2 } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

import { StatusPill } from "@/components/status-pill";
import {
  createNote,
  createQuestions,
  dashboardSummary,
  deleteNote,
  listNotes,
  login,
  me,
  register,
  summarizeNote,
  updateNote
} from "@/lib/api";
import type { DashboardSummary, LearningNote, NoteStatus } from "@/lib/types";

const emptyDraft: LearningNote = {
  id: 0,
  title: "",
  content: "",
  status: "draft",
  tags: [],
  createdAt: "",
  updatedAt: ""
};

export default function Home() {
  const [token, setToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");
  const [notes, setNotes] = useState<LearningNote[]>([]);
  const [selectedId, setSelectedId] = useState(0);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<LearningNote>(emptyDraft);
  const [aiResult, setAiResult] = useState("");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const filteredNotes = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return notes;
    return notes.filter((note) => {
      return (
        note.title.toLowerCase().includes(value) ||
        note.tags.some((tag) => tag.toLowerCase().includes(value))
      );
    });
  }, [notes, query]);

  const statItems = [
    { label: "노트", value: String(summary?.totalNotes ?? notes.length) },
    { label: "태그", value: String(summary?.totalTags ?? 0) },
    { label: "AI", value: String(summary?.aiOutputs ?? 0) }
  ];

  useEffect(() => {
    const saved = window.localStorage.getItem("ai-learning-token");
    if (!saved) return;
    setToken(saved);
    void loadWorkspace(saved);
  }, []);

  async function run(action: () => Promise<void>, fallback = "요청 실패") {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage(error instanceof Error ? fallback : "오류");
    } finally {
      setBusy(false);
    }
  }

  async function loadWorkspace(nextToken = token, nextQuery = query, preferredId = selectedId) {
    const [profile, nextNotes, nextSummary] = await Promise.all([
      me(nextToken),
      listNotes(nextToken, nextQuery),
      dashboardSummary(nextToken)
    ]);
    setUserEmail(profile.email);
    setNotes(nextNotes);
    setSummary(nextSummary);

    const selected = nextNotes.find((note) => note.id === preferredId) ?? nextNotes[0] ?? emptyDraft;
    setSelectedId(selected.id);
    setDraft(selected);
  }

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run(async () => {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || password.length < 8) {
        setMessage("입력 확인");
        return;
      }

      try {
        await register(trimmedEmail, password);
      } catch (error) {
        const text = error instanceof Error ? error.message : "";
        if (!text.includes("409")) {
          throw error;
        }
      }
      const response = await login(trimmedEmail, password);
      window.localStorage.setItem("ai-learning-token", response.access_token);
      setToken(response.access_token);
      await loadWorkspace(response.access_token);
    }, "로그인 실패");
  }

  function logout() {
    window.localStorage.removeItem("ai-learning-token");
    setToken("");
    setUserEmail("");
    setNotes([]);
    setSelectedId(0);
    setDraft(emptyDraft);
    setSummary(null);
    setAiResult("");
  }

  function selectNote(note: LearningNote) {
    setSelectedId(note.id);
    setDraft(note);
    setAiResult("");
  }

  async function addNote() {
    await run(async () => {
      const note = await createNote(token, {
        title: "새 노트",
        content: "내용",
        status: "draft",
        tags: []
      });
      setSelectedId(note.id);
      setDraft(note);
      await loadWorkspace(token, query, note.id);
    });
  }

  async function saveNote() {
    if (!draft.id) return;
    await run(async () => {
      const saved = await updateNote(token, draft.id, {
        title: draft.title || "새 노트",
        content: draft.content || "내용",
        status: draft.status,
        tags: draft.tags
      });
      setDraft(saved);
      await loadWorkspace(token, query, saved.id);
    });
  }

  async function removeNote() {
    if (!selectedId) return;
    await run(async () => {
      await deleteNote(token, selectedId);
      setSelectedId(0);
      setDraft(emptyDraft);
      await loadWorkspace(token, query, 0);
    });
  }

  async function refreshSearch(value: string) {
    setQuery(value);
    if (!token) return;
    await run(async () => {
      const nextNotes = await listNotes(token, value);
      setNotes(nextNotes);
      const selected = nextNotes.find((note) => note.id === selectedId) ?? nextNotes[0] ?? emptyDraft;
      setSelectedId(selected.id);
      setDraft(selected);
    });
  }

  async function createAiOutput(kind: "summary" | "questions") {
    if (!selectedId) return;
    await run(async () => {
      const output =
        kind === "summary"
          ? await summarizeNote(token, selectedId)
          : await createQuestions(token, selectedId);
      setAiResult(output.content);
      const nextSummary = await dashboardSummary(token);
      setSummary(nextSummary);
    });
  }

  if (!token) {
    return (
      <main className="auth-page">
        <form className="auth-panel" onSubmit={submitAuth}>
          <div className="brand auth-brand">
            <FileText size={18} />
            <span>AI Learning</span>
          </div>
          <label className="field">
            <span>Email</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button className="primary-button" disabled={busy}>
            로그인
          </button>
          {message ? <p className="message">{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="workspace">
      <aside className="sidebar">
        <div className="brand">
          <FileText size={18} />
          <span>AI Learning</span>
        </div>

        <div className="search">
          <Search size={16} />
          <input
            aria-label="검색"
            value={query}
            onChange={(event) => void refreshSearch(event.target.value)}
            placeholder="검색"
          />
        </div>

        <button className="primary-button" onClick={() => void addNote()} disabled={busy}>
          <Plus size={16} />
          <span>새 노트</span>
        </button>

        <nav className="note-list" aria-label="노트">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              className={note.id === selectedId ? "note-item active" : "note-item"}
              onClick={() => selectNote(note)}
            >
              <span className="note-title">{note.title}</span>
              <span className="note-meta">{note.updatedAt}</span>
            </button>
          ))}
          {filteredNotes.length === 0 ? <span className="empty-text">노트 없음</span> : null}
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div className="stats">
            {statItems.map((stat) => (
              <div className="stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="actions">
            <span className="user-email">{userEmail}</span>
            <button className="icon-button" onClick={() => void saveNote()} aria-label="저장" disabled={busy}>
              <Save size={16} />
              <span>저장</span>
            </button>
            <button className="icon-button danger" onClick={() => void removeNote()} aria-label="삭제" disabled={busy}>
              <Trash2 size={16} />
              <span>삭제</span>
            </button>
            <button className="icon-button" onClick={logout} aria-label="로그아웃">
              <LogOut size={16} />
              <span>나가기</span>
            </button>
          </div>
        </header>

        <div className="main-grid">
          <section className="editor-panel">
            <div className="panel-title">
              <span>노트</span>
              <StatusPill status={draft.status} />
            </div>

            <label className="field">
              <span>제목</span>
              <input
                value={draft.title}
                disabled={!draft.id}
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              />
            </label>

            <label className="field">
              <span>본문</span>
              <textarea
                value={draft.content}
                disabled={!draft.id}
                onChange={(event) => setDraft({ ...draft, content: event.target.value })}
              />
            </label>

            <label className="field">
              <span>태그</span>
              <input
                value={draft.tags.join(", ")}
                disabled={!draft.id}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    tags: event.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  })
                }
              />
            </label>
          </section>

          <section className="ai-panel">
            <div className="panel-title">
              <span>AI</span>
              <Sparkles size={16} />
            </div>

            <div className="ai-actions">
              <button onClick={() => void createAiOutput("summary")} disabled={!selectedId || busy}>
                요약
              </button>
              <button onClick={() => void createAiOutput("questions")} disabled={!selectedId || busy}>
                질문 생성
              </button>
            </div>

            <pre className="ai-result">{aiResult || "결과 없음"}</pre>
            {message ? <p className="message">{message}</p> : null}
          </section>
        </div>
      </section>
    </main>
  );
}
