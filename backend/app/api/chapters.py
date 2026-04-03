from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.schemas.schemas import ChapterResponse, ChapterNavigation
from app.services.content_service import load_course_content

router = APIRouter(prefix="/chapters", tags=["chapters"])

@router.get("/", response_model=List[ChapterResponse])
async def list_chapters(db: AsyncSession = Depends(get_db)):
    chapters = load_course_content()
    return [ChapterResponse(**ch) for ch in chapters]

@router.get("/{chapter_id}", response_model=ChapterResponse)
async def get_chapter(chapter_id: str, db: AsyncSession = Depends(get_db)):
    chapters = load_course_content()
    for ch in chapters:
        if ch["chapter_id"] == chapter_id:
            return ChapterResponse(**ch)
    raise HTTPException(status_code=404, detail="Chapter not found")

@router.get("/{chapter_id}/navigation", response_model=ChapterNavigation)
async def get_chapter_navigation(chapter_id: str, db: AsyncSession = Depends(get_db)):
    chapters = load_course_content()
    current = None
    current_idx = -1
    
    for i, ch in enumerate(chapters):
        if ch["chapter_id"] == chapter_id:
            current = ChapterResponse(**ch)
            current_idx = i
            break
    
    if not current:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    prev_chapter = None
    next_chapter = None
    
    if current_idx > 0:
        prev_chapter = ChapterResponse(**chapters[current_idx - 1])
    if current_idx < len(chapters) - 1:
        next_chapter = ChapterResponse(**chapters[current_idx + 1])
    
    return ChapterNavigation(current=current, previous=prev_chapter, next=next_chapter)
