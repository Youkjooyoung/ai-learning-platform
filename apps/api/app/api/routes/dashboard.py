from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.api.routes.notes import to_note_response
from app.db.session import get_session
from app.models import AIOutput, LearningNote, Tag, User
from app.schemas import DashboardSummary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary)
async def summary(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
):
    total_notes = await session.scalar(
        select(func.count()).select_from(LearningNote).where(LearningNote.owner_id == user.id)
    )
    total_tags = await session.scalar(select(func.count()).select_from(Tag).where(Tag.owner_id == user.id))
    ai_outputs = await session.scalar(
        select(func.count())
        .select_from(AIOutput)
        .join(LearningNote)
        .where(LearningNote.owner_id == user.id)
    )
    recent_result = await session.execute(
        select(LearningNote)
        .options(selectinload(LearningNote.tags))
        .where(LearningNote.owner_id == user.id)
        .order_by(LearningNote.updated_at.desc())
        .limit(5)
    )

    return DashboardSummary(
        total_notes=total_notes or 0,
        total_tags=total_tags or 0,
        ai_outputs=ai_outputs or 0,
        recent_notes=[to_note_response(note) for note in recent_result.scalars().all()],
    )

