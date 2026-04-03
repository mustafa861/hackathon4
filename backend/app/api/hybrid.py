import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.config import settings
from app.schemas.schemas import HybridFeatureRequest, HybridFeatureResponse
from app.services.progress_service import ProgressService
from app.services.content_service import load_course_content, load_quiz_data

router = APIRouter(prefix="/hybrid", tags=["hybrid"])

ALLOWED_HYBRID_FEATURES = ["adaptive_path", "llm_assessment"]

ADAPTIVE_PATH_PROMPT = """You are an AI education advisor. Based on the student's progress data below, recommend a personalized learning path.

Student Progress:
{progress_data}

Course Chapters:
{chapters_data}

Respond with ONLY valid JSON in this exact format:
{{
  "recommended_path": ["ch1", "ch2", ...],
  "reasoning": "Brief explanation of why this path",
  "weak_areas": ["topic1", "topic2"],
  "strong_areas": ["topic1", "topic2"],
  "estimated_time_hours": 10
}}
"""

LLM_ASSESSMENT_PROMPT = """You are an AI education assessor. Based on the student's quiz performance and progress, provide a comprehensive assessment.

Student Progress:
{progress_data}

Quiz Results:
{quiz_data}

Respond with ONLY valid JSON in this exact format:
{{
  "assessment": "Overall assessment paragraph",
  "score": 85,
  "feedback": "Specific feedback paragraph",
  "next_steps": ["step1", "step2", "step3"],
  "strengths": ["strength1", "strength2"],
  "areas_for_improvement": ["area1", "area2"]
}}
"""


async def call_llm(prompt: str) -> tuple[str, int, float]:
    """Call the LLM API and return (response_text, tokens_used, cost)."""
    from openai import AsyncOpenAI

    if settings.LLM_PROVIDER == "groq":
        api_key = os.environ.get("GROQ_API_KEY") or settings.GROQ_API_KEY
        if not api_key:
            raise HTTPException(status_code=503, detail="GROQ_API_KEY not configured. Set it in .env or environment.")
        client = AsyncOpenAI(
            api_key=api_key,
            base_url=settings.GROQ_BASE_URL,
        )
        model = settings.GROQ_MODEL
        cost_per_token = 0.00000059
    else:
        api_key = os.environ.get("OPENAI_API_KEY") or settings.OPENAI_API_KEY
        if not api_key:
            raise HTTPException(status_code=503, detail="OPENAI_API_KEY not configured.")
        client = AsyncOpenAI(api_key=api_key)
        model = settings.OPENAI_MODEL
        cost_per_token = 0.00000015

    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=500,
    )

    text = response.choices[0].message.content or ""
    tokens = response.usage.total_tokens if response.usage else 0
    cost = tokens * cost_per_token

    return text, tokens, cost


@router.post("/feature", response_model=HybridFeatureResponse)
async def hybrid_feature(request: HybridFeatureRequest, db: AsyncSession = Depends(get_db)):
    if settings.PHASE < 2:
        raise HTTPException(status_code=403, detail="Hybrid features require Phase 2")

    if request.feature not in ALLOWED_HYBRID_FEATURES:
        raise HTTPException(status_code=400, detail=f"Feature not allowed. Choose from: {ALLOWED_HYBRID_FEATURES}")

    user = await ProgressService.get_or_create_user(db, request.user_id)
    if user.tier not in ["pro", "team"]:
        raise HTTPException(status_code=403, detail="This feature requires Pro or Team tier")

    progress = await ProgressService.get_user_progress(db, request.user_id)
    progress_json = json.dumps({
        "completed_chapters": progress.completed_chapters,
        "completion_percentage": progress.completion_percentage,
        "quiz_scores": progress.quiz_scores,
        "chapters": [{"id": c.chapter_id, "completed": c.completed, "score": c.score} for c in progress.chapters],
    }, indent=2)

    if request.feature == "adaptive_path":
        chapters = load_course_content()
        chapters_json = json.dumps([{"id": c["chapter_id"], "title": c["title"], "order": c["order"], "prerequisites": c.get("prerequisites", [])} for c in chapters], indent=2)
        prompt = ADAPTIVE_PATH_PROMPT.format(progress_data=progress_json, chapters_data=chapters_json)

        response_text, tokens, cost = await call_llm(prompt)

        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            result = {
                "recommended_path": ["ch1", "ch2", "ch3"],
                "reasoning": response_text[:500],
                "weak_areas": [],
                "strong_areas": [],
                "estimated_time_hours": 5,
            }

    elif request.feature == "llm_assessment":
        quizzes = load_quiz_data()
        quiz_json = json.dumps([{"id": q["quiz_id"], "title": q["title"], "passing_score": q["passing_score"]} for q in quizzes], indent=2)
        prompt = LLM_ASSESSMENT_PROMPT.format(progress_data=progress_json, quiz_data=quiz_json)

        response_text, tokens, cost = await call_llm(prompt)

        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            result = {
                "assessment": response_text[:500],
                "score": 75,
                "feedback": "Review the chapters you haven't completed yet.",
                "next_steps": ["Continue with remaining chapters"],
                "strengths": [],
                "areas_for_improvement": [],
            }
    else:
        raise HTTPException(status_code=400, detail="Unknown feature")

    return HybridFeatureResponse(
        feature=request.feature,
        result=result,
        cost=round(cost, 6),
        tokens_used=tokens,
    )
