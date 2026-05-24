"use client";

import { FileText, Plus, Save, Search, Sparkles, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { StatusPill } from "@/components/status-pill";
import { initialNotes, stats } from "@/lib/mock-data";
import type { LearningNote } from "@/lib/types";

function buildSummary(note: LearningNote) {
  return `${note.title}: ${note.content.slice(0, 90)}`;
}

function buildQuestions(note: LearningNote) {
  return [
    `${note.title}의 핵심 개념은 무엇인가?`,
    "구현할 때 확인할 조건은 무엇인가?",
    "다음에 보완할 점은 무엇인가?"
  ];
}

export default function Home() {
  const [notes, setNotes] = useState(initialNotes);
  const [selectedId, setSelectedId] = useState(initialNotes[0]?.id ?? 0);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState(initialNotes[0]);
  const [aiResult, setAiResult] = useState(buildSummary(initialNotes[0]));

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

  function selectNote(note: LearningNote) {
    setSelectedId(note.id);
    setDraft(note);
    setAiResult(buildSummary(note));
  }

  function createNote() {
    const next: LearningNote = {
      id: Date.now(),
      title: "새 노트",
      content: "",
      status: "draft",
      tags: [],
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setNotes((current) => [next, ...current]);
    selectNote(next);
  }

  function saveNote() {
    setNotes((current) => current.map((note) => (note.id === draft.id ? draft : note)));
  }

  function deleteNote() {
    const remaining = notes.filter((note) => note.id !== selectedId);
    setNotes(remaining);
    const next = remaining[0];
    if (next) {
      selectNote(next);
    }
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="검색"
          />
        </div>

        <button className="primary-button" onClick={createNote}>
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
        </nav>
      </aside>

      <section className="content">
        <header className="topbar">
          <div className="stats">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="actions">
            <button className="icon-button" onClick={saveNote} aria-label="저장">
              <Save size={16} />
              <span>저장</span>
            </button>
            <button className="icon-button danger" onClick={deleteNote} aria-label="삭제">
              <Trash2 size={16} />
              <span>삭제</span>
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
                onChange={(event) => setDraft({ ...draft, title: event.target.value })}
              />
            </label>

            <label className="field">
              <span>본문</span>
              <textarea
                value={draft.content}
                onChange={(event) => setDraft({ ...draft, content: event.target.value })}
              />
            </label>

            <label className="field">
              <span>태그</span>
              <input
                value={draft.tags.join(", ")}
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
              <button onClick={() => setAiResult(buildSummary(draft))}>요약</button>
              <button onClick={() => setAiResult(buildQuestions(draft).join("\n"))}>질문 생성</button>
            </div>

            <pre className="ai-result">{aiResult}</pre>
          </section>
        </div>
      </section>
    </main>
  );
}

