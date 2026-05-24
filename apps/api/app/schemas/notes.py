from datetime import datetime

from pydantic import BaseModel, Field


class NoteBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    status: str = Field(default="draft", max_length=30)
    tags: list[str] = Field(default_factory=list)


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, min_length=1)
    status: str | None = Field(default=None, max_length=30)
    tags: list[str] | None = None


class NoteResponse(NoteBase):
    id: int
    created_at: datetime
    updated_at: datetime


class AIOutputResponse(BaseModel):
    id: int
    note_id: int
    output_type: str
    provider: str
    content: str
    created_at: datetime


class DashboardSummary(BaseModel):
    total_notes: int
    total_tags: int
    ai_outputs: int
    recent_notes: list[NoteResponse]

