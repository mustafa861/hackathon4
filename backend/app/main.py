from app.core.database import engine, init_db
from app.core.config import settings

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chapters, quizzes, progress, access, search, hybrid

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Course Companion FTE - Digital Full-Time Equivalent Educational Tutor"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chapters.router, prefix=settings.API_V1_PREFIX)
app.include_router(quizzes.router, prefix=settings.API_V1_PREFIX)
app.include_router(progress.router, prefix=settings.API_V1_PREFIX)
app.include_router(access.router, prefix=settings.API_V1_PREFIX)
app.include_router(search.router, prefix=settings.API_V1_PREFIX)
app.include_router(hybrid.router, prefix=settings.API_V1_PREFIX)

@app.on_event("startup")
async def startup():
    await init_db()

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "phase": settings.PHASE,
        "architecture": "Zero-Backend-LLM" if settings.PHASE == 1 else "Hybrid Intelligence"
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
