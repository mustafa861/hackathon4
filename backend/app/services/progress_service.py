from typing import Dict, List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.models import User, Progress, QuizAttempt
from app.schemas.schemas import UserProgress, ProgressResponse
from app.services.content_service import load_course_content
from datetime import datetime, timedelta

class ProgressService:
    @staticmethod
    async def get_or_create_user(db: AsyncSession, user_id: str) -> User:
        result = await db.execute(select(User).where(User.user_id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            user = User(user_id=user_id, tier="free")
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user
    
    @staticmethod
    async def update_progress(db: AsyncSession, user_id: str, chapter_id: str, completed: bool = False, time_spent: int = 0, score: float = 0.0) -> Progress:
        result = await db.execute(
            select(Progress).where(Progress.user_id == user_id, Progress.chapter_id == chapter_id)
        )
        progress = result.scalar_one_or_none()
        
        if not progress:
            progress = Progress(user_id=user_id, chapter_id=chapter_id)
            db.add(progress)
        
        if completed:
            progress.completed = True
        if time_spent > 0:
            progress.time_spent = (progress.time_spent or 0) + time_spent
        if score > 0:
            progress.score = max(progress.score or 0, score)
        
        progress.last_accessed = datetime.utcnow()
        await db.commit()
        await db.refresh(progress)
        return progress
    
    @staticmethod
    async def get_user_progress(db: AsyncSession, user_id: str) -> UserProgress:
        result = await db.execute(select(Progress).where(Progress.user_id == user_id))
        progress_records = result.scalars().all()
        
        chapters_data = load_course_content()
        total_chapters = len(chapters_data)
        completed_chapters = sum(1 for p in progress_records if p.completed)
        completion_percentage = (completed_chapters / total_chapters * 100) if total_chapters > 0 else 0
        
        current_streak = 0
        total_streak = 0
        if progress_records:
            last_accessed = max(p.last_accessed for p in progress_records)
            days_since_last = (datetime.utcnow() - last_accessed.replace(tzinfo=None)).days
            if days_since_last <= 1:
                current_streak = completed_chapters
            total_streak = completed_chapters
        
        quiz_results = await db.execute(select(QuizAttempt).where(QuizAttempt.user_id == user_id).order_by(QuizAttempt.attempted_at.desc()))
        quiz_attempts = quiz_results.scalars().all()
        quiz_scores = [{"quiz_id": q.quiz_id, "score": q.score, "passed": q.passed, "attempted_at": q.attempted_at.isoformat()} for q in quiz_attempts]
        
        chapters = [
            ProgressResponse(
                user_id=p.user_id,
                chapter_id=p.chapter_id,
                completed=p.completed,
                time_spent=p.time_spent,
                last_accessed=p.last_accessed,
                score=p.score
            ) for p in progress_records
        ]
        
        return UserProgress(
            user_id=user_id,
            total_chapters=total_chapters,
            completed_chapters=completed_chapters,
            completion_percentage=round(completion_percentage, 2),
            current_streak=current_streak,
            total_streak=total_streak,
            quiz_scores=quiz_scores,
            chapters=chapters
        )
