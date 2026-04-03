from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.schemas import ProgressUpdate, ProgressResponse, UserProgress
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/{user_id}", response_model=UserProgress)
async def get_progress(user_id: str, db: AsyncSession = Depends(get_db)):
    await ProgressService.get_or_create_user(db, user_id)
    return await ProgressService.get_user_progress(db, user_id)

@router.put("/{user_id}", response_model=ProgressResponse)
async def update_progress(user_id: str, update: ProgressUpdate, db: AsyncSession = Depends(get_db)):
    await ProgressService.get_or_create_user(db, user_id)
    progress = await ProgressService.update_progress(
        db, user_id, update.chapter_id, update.completed, update.time_spent, update.score
    )
    return ProgressResponse(
        user_id=progress.user_id,
        chapter_id=progress.chapter_id,
        completed=progress.completed,
        time_spent=progress.time_spent,
        last_accessed=progress.last_accessed,
        score=progress.score
    )
