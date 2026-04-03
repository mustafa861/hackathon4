from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Course Companion FTE"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "sqlite+aiosqlite:///./course_companion.db"
    PHASE: int = 1
    
    class Config:
        env_file = ".env"

settings = Settings()
