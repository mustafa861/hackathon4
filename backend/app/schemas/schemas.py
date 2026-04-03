from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class ChapterContent(BaseModel):
    section: str
    text: str
    code_examples: Optional[List[Dict[str, str]]] = []
    key_points: Optional[List[str]] = []

class ChapterCreate(BaseModel):
    chapter_id: str
    title: str
    description: str
    content: List[ChapterContent]
    order: int
    is_premium: bool = False
    prerequisites: List[str] = []

class ChapterResponse(BaseModel):
    chapter_id: str
    title: str
    description: str
    content: List[ChapterContent]
    order: int
    is_premium: bool
    prerequisites: List[str]
    
    class Config:
        from_attributes = True

class ChapterNavigation(BaseModel):
    current: ChapterResponse
    previous: Optional[ChapterResponse] = None
    next: Optional[ChapterResponse] = None

class Question(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    explanation: str

class QuizCreate(BaseModel):
    quiz_id: str
    chapter_id: str
    title: str
    questions: List[Question]
    passing_score: float = 70.0
    is_premium: bool = False

class QuizResponse(BaseModel):
    quiz_id: str
    chapter_id: str
    title: str
    questions: List[Question]
    passing_score: float
    is_premium: bool
    
    class Config:
        from_attributes = True

class QuizSubmission(BaseModel):
    answers: Dict[str, int]

class QuizResult(BaseModel):
    quiz_id: str
    score: float
    passed: bool
    total_questions: int
    correct_answers: int
    feedback: Dict[str, str] = {}

class ProgressUpdate(BaseModel):
    chapter_id: str
    completed: bool = False
    time_spent: int = 0
    score: float = 0.0

class ProgressResponse(BaseModel):
    user_id: str
    chapter_id: str
    completed: bool
    time_spent: int
    last_accessed: datetime
    score: float
    
    class Config:
        from_attributes = True

class UserProgress(BaseModel):
    user_id: str
    total_chapters: int
    completed_chapters: int
    completion_percentage: float
    current_streak: int
    total_streak: int
    quiz_scores: List[Dict[str, Any]]
    chapters: List[ProgressResponse]

class AccessCheck(BaseModel):
    user_id: str
    chapter_id: str

class AccessResponse(BaseModel):
    has_access: bool
    tier: str
    chapter_id: str
    is_premium: bool
    message: str

class SearchResponse(BaseModel):
    query: str
    results: List[Dict[str, Any]]
    total_results: int

class HybridFeatureRequest(BaseModel):
    user_id: str
    feature: str
    data: Dict[str, Any]

class HybridFeatureResponse(BaseModel):
    feature: str
    result: Dict[str, Any]
    cost: float
    tokens_used: int
