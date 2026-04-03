from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.schemas.schemas import HybridFeatureRequest, HybridFeatureResponse
from app.services.progress_service import ProgressService

router = APIRouter(prefix="/hybrid", tags=["hybrid"])

ALLOWED_HYBRID_FEATURES = ["adaptive_path", "llm_assessment"]

@router.post("/feature", response_model=HybridFeatureResponse)
async def hybrid_feature(request: HybridFeatureRequest, db: AsyncSession = Depends(get_db)):
    if settings.PHASE < 2:
        raise HTTPException(status_code=403, detail="Hybrid features require Phase 2")
    
    if request.feature not in ALLOWED_HYBRID_FEATURES:
        raise HTTPException(status_code=400, detail=f"Feature not allowed. Choose from: {ALLOWED_HYBRID_FEATURES}")
    
    user = await ProgressService.get_or_create_user(db, request.user_id)
    if user.tier not in ["pro", "team"]:
        raise HTTPException(status_code=403, detail="This feature requires Pro or Team tier")
    
    if request.feature == "adaptive_path":
        result = {
            "recommended_path": ["ch1", "ch3", "ch5", "ch7"],
            "reasoning": "Based on your progress and quiz scores, we recommend focusing on advanced agent patterns.",
            "weak_areas": ["mcp_protocol", "agent_skills"],
            "strong_areas": ["agent_basics", "prompt_engineering"]
        }
        cost = 0.018
        tokens = 2000
    elif request.feature == "llm_assessment":
        result = {
            "assessment": "Your understanding of agent concepts is solid. Focus on practical implementation.",
            "score": 85,
            "feedback": "Consider building a real MCP server to strengthen your skills.",
            "next_steps": ["Build MCP server", "Study agent orchestration", "Practice with real tools"]
        }
        cost = 0.014
        tokens = 1500
    else:
        raise HTTPException(status_code=400, detail="Unknown feature")
    
    return HybridFeatureResponse(
        feature=request.feature,
        result=result,
        cost=cost,
        tokens_used=tokens
    )
