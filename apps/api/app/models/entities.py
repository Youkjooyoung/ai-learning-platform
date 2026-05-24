from datetime import UTC, datetime

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


def now_utc() -> datetime:
    return datetime.now(UTC)


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)

    notes: Mapped[list["LearningNote"]] = relationship(back_populates="owner")
    tags: Mapped[list["Tag"]] = relationship(back_populates="owner")


class LearningNote(Base):
    __tablename__ = "learning_notes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=now_utc, onupdate=now_utc
    )

    owner: Mapped[User] = relationship(back_populates="notes")
    tags: Mapped[list["Tag"]] = relationship(
        secondary="note_tags",
        back_populates="notes",
        lazy="selectin",
    )
    ai_outputs: Mapped[list["AIOutput"]] = relationship(
        back_populates="note",
        cascade="all, delete-orphan",
    )


class Tag(Base):
    __tablename__ = "tags"
    __table_args__ = (UniqueConstraint("owner_id", "name", name="uq_tags_owner_name"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    name: Mapped[str] = mapped_column(String(40))

    owner: Mapped[User] = relationship(back_populates="tags")
    notes: Mapped[list[LearningNote]] = relationship(
        secondary="note_tags",
        back_populates="tags",
    )


class NoteTag(Base):
    __tablename__ = "note_tags"

    note_id: Mapped[int] = mapped_column(ForeignKey("learning_notes.id"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id"), primary_key=True)


class AIOutput(Base):
    __tablename__ = "ai_outputs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    note_id: Mapped[int] = mapped_column(ForeignKey("learning_notes.id"), index=True)
    output_type: Mapped[str] = mapped_column(String(30))
    provider: Mapped[str] = mapped_column(String(30))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)

    note: Mapped[LearningNote] = relationship(back_populates="ai_outputs")

