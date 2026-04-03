from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.schemas.schemas import QuizResponse, QuizSubmission, QuizResult
from app.services.content_service import load_quiz_data

router = APIRouter(prefix="/quizzes", tags=["quizzes"])

@router.get("/", response_model=List[QuizResponse])
async def list_quizzes(db: AsyncSession = Depends(get_db)):
    quizzes = load_quiz_data()
    return [QuizResponse(**q) for q in quizzes]

@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(quiz_id: str, db: AsyncSession = Depends(get_db)):
    quizzes = load_quiz_data()
    for q in quizzes:
        if q["quiz_id"] == quiz_id:
            return QuizResponse(**q)
    raise HTTPException(status_code=404, detail="Quiz not found")

@router.post("/{quiz_id}/submit", response_model=QuizResult)
async def submit_quiz(quiz_id: str, submission: QuizSubmission, db: AsyncSession = Depends(get_db)):
    quizzes = load_quiz_data()
    quiz = None
    for q in quizzes:
        if q["quiz_id"] == quiz_id:
            quiz = q
            break
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    total_questions = len(quiz["questions"])
    correct_answers = 0
    feedback = {}
    
    for q_idx, question in enumerate(quiz["questions"]):
        q_id = f"q{q_idx + 1}"
        user_answer = submission.answers.get(q_id)
        
        if user_answer is not None:
            if user_answer == question["correct_answer"]:
                correct_answers += 1
                feedback[q_id] = "Correct! " + question["explanation"]
            else:
                feedback[q_id] = f"Incorrect. The correct answer was: {question['options'][question['correct_answer']]}. {question['explanation']}"
        else:
            feedback[q_id] = "No answer provided."
    
    score = (correct_answers / total_questions * 100) if total_questions > 0 else 0
    passed = score >= quiz.get("passing_score", 70.0)
    
    return QuizResult(
        quiz_id=quiz_id,
        score=round(score, 2),
        passed=passed,
        total_questions=total_questions,
        correct_answers=correct_answers,
        feedback=feedback
    )
