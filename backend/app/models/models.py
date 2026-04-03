from app.core.database import Base
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, nullable=True)
    tier = Column(String, default="free")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    progress = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")

class Chapter(Base):
    __tablename__ = "chapters"
    
    id = Column(Integer, primary_key=True, index=True)
    chapter_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    content = Column(JSON, nullable=False)
    order = Column(Integer, nullable=False)
    is_premium = Column(Boolean, default=False)
    prerequisites = Column(JSON, default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(String, unique=True, index=True, nullable=False)
    chapter_id = Column(String, ForeignKey("chapters.chapter_id"), nullable=False)
    title = Column(String, nullable=False)
    questions = Column(JSON, nullable=False)
    passing_score = Column(Float, default=70.0)
    is_premium = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Progress(Base):
    __tablename__ = "progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    chapter_id = Column(String, nullable=False)
    completed = Column(Boolean, default=False)
    time_spent = Column(Integer, default=0)
    last_accessed = Column(DateTime(timezone=True), server_default=func.now())
    score = Column(Float, default=0.0)
    
    user = relationship("User", back_populates="progress")

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.user_id"), nullable=False)
    quiz_id = Column(String, nullable=False)
    answers = Column(JSON, nullable=False)
    score = Column(Float, nullable=False)
    passed = Column(Boolean, default=False)
    attempted_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="quiz_attempts")
