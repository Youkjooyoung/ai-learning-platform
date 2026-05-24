from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.session import get_session
from app.models import AIOutput, LearningNote, NoteTag, Tag, User
from app.schemas import AIOutputResponse, NoteCreate, NoteResponse, NoteUpdate
from app.services.ai import get_ai_service

router = APIRouter()


def to_note_response(note: LearningNote) -> NoteResponse:
    return NoteResponse(
        id=note.id,
        title=note.title,
        content=note.content,
        status=note.status,
        tags=[tag.name for tag in note.tags],
        created_at=note.created_at,
        updated_at=note.updated_at,
    )


async def get_note_or_404(session: AsyncSession, note_id: int, owner_id: int) -> LearningNote:
    result = await session.execute(
        select(LearningNote)
        .options(selectinload(LearningNote.tags))
        .where(LearningNote.id == note_id, LearningNote.owner_id == owner_id)
    )
    note = result.scalar_one_or_none()
    if note is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="note not found")
    return note


async def sync_tags(session: AsyncSession, note: LearningNote, user: User, tag_names: list[str]) -> None:
    clean_names = sorted({name.strip() for name in tag_names if name.strip()})
    await session.execute(delete(NoteTag).where(NoteTag.note_id == note.id))
    for name in clean_names:
        result = await session.execute(select(Tag).where(Tag.owner_id == user.id, Tag.name == name))
        tag = result.scalar_one_or_none()
        if tag is None:
            tag = Tag(owner_id=user.id, name=name)
            session.add(tag)
            await session.flush()
        session.add(NoteTag(note_id=note.id, tag_id=tag.id))


@router.get("", response_model=list[NoteResponse])
async def list_notes(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
    q: str | None = Query(default=None),
    tag: str | None = Query(default=None),
):
    statement = (
        select(LearningNote)
        .options(selectinload(LearningNote.tags))
        .where(LearningNote.owner_id == user.id)
        .order_by(LearningNote.updated_at.desc())
    )
    if q:
        statement = statement.where(LearningNote.title.ilike(f"%{q}%"))
    if tag:
        statement = statement.join(LearningNote.tags).where(Tag.name == tag)

    result = await session.execute(statement)
    return [to_note_response(note) for note in result.scalars().unique().all()]


@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(
    payload: NoteCreate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    note = LearningNote(
        owner_id=user.id,
        title=payload.title,
        content=payload.content,
        status=payload.status,
    )
    session.add(note)
    await session.flush()
    await sync_tags(session, note, user, payload.tags)
    await session.commit()
    saved = await get_note_or_404(session, note.id, user.id)
    return to_note_response(saved)


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(
    note_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    note = await get_note_or_404(session, note_id, user.id)
    return to_note_response(note)


@router.patch("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int,
    payload: NoteUpdate,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    note = await get_note_or_404(session, note_id, user.id)
    if payload.title is not None:
        note.title = payload.title
    if payload.content is not None:
        note.content = payload.content
    if payload.status is not None:
        note.status = payload.status
    if payload.tags is not None:
        await sync_tags(session, note, user, payload.tags)
    await session.commit()
    saved = await get_note_or_404(session, note.id, user.id)
    return to_note_response(saved)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(
    note_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    note = await get_note_or_404(session, note_id, user.id)
    await session.delete(note)
    await session.commit()


async def create_ai_output(
    session: AsyncSession,
    note: LearningNote,
    output_type: str,
    content: str,
    provider: str,
) -> AIOutput:
    output = AIOutput(
        note_id=note.id,
        output_type=output_type,
        content=content,
        provider=provider,
    )
    session.add(output)
    await session.commit()
    await session.refresh(output)
    return output


@router.post("/{note_id}/summarize", response_model=AIOutputResponse)
async def summarize_note(
    note_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    note = await get_note_or_404(session, note_id, user.id)
    service = get_ai_service()
    content = await service.summarize(note.title, note.content)
    return await create_ai_output(session, note, "summary", content, service.provider_name)


@router.post("/{note_id}/questions", response_model=AIOutputResponse)
async def create_questions(
    note_id: int,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    note = await get_note_or_404(session, note_id, user.id)
    service = get_ai_service()
    content = await service.questions(note.title, note.content)
    return await create_ai_output(session, note, "questions", content, service.provider_name)
