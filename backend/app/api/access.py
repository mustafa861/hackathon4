from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.schemas import AccessCheck, AccessResponse
from app.services.content_service import load_course_content
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/access", tags=["access"])

@router.post("/check", response_model=AccessResponse)
async def check_access(check: AccessCheck, db: AsyncSession = Depends(get_db)):
    chapters = load_course_content()
    chapter = None
    for ch in chapters:
        if ch["chapter_id"] == check.chapter_id:
            chapter = ch
            break
    
    if not chapter:
        raise HTTPException(status_code=404, detail="Chapter not found")
    
    user = await ProgressService.get_or_create_user(db, check.user_id)
    is_premium = chapter.get("is_premium", False)
    has_access = True
    message = "Access granted"
    
    if is_premium and user.tier == "free":
        has_access = False
        message = "This chapter requires Premium tier. Upgrade to access this content."
    
    return AccessResponse(
        has_access=has_access,
        tier=user.tier,
        chapter_id=check.chapter_id,
        is_premium=is_premium,
        message=message
    )
