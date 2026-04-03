import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from app.main import app
from app.core.database import Base, get_db
from app.models.models import User, Progress, QuizAttempt

TEST_DATABASE_URL = "sqlite+aiosqlite:///./test_course_companion.db"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
test_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest_asyncio.fixture(scope="function", autouse=True)
async def setup_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session():
    async with test_session() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Course Companion FTE"
    assert data["phase"] == 1
    assert data["architecture"] == "Zero-Backend-LLM"


@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_list_chapters(client):
    response = await client.get("/api/v1/chapters/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    assert data[0]["chapter_id"] == "ch1"
    assert data[0]["is_premium"] is False
    assert data[9]["chapter_id"] == "ch10"
    assert data[9]["is_premium"] is True


@pytest.mark.asyncio
async def test_get_chapter(client):
    response = await client.get("/api/v1/chapters/ch1")
    assert response.status_code == 200
    data = response.json()
    assert data["chapter_id"] == "ch1"
    assert data["title"] == "Introduction to AI Agents"
    assert len(data["content"]) == 4


@pytest.mark.asyncio
async def test_get_chapter_not_found(client):
    response = await client.get("/api/v1/chapters/nonexistent")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_chapter_navigation(client):
    response = await client.get("/api/v1/chapters/ch1/navigation")
    assert response.status_code == 200
    data = response.json()
    assert data["current"]["chapter_id"] == "ch1"
    assert data["previous"] is None
    assert data["next"]["chapter_id"] == "ch2"

    response = await client.get("/api/v1/chapters/ch5/navigation")
    data = response.json()
    assert data["previous"]["chapter_id"] == "ch4"
    assert data["next"]["chapter_id"] == "ch6"

    response = await client.get("/api/v1/chapters/ch10/navigation")
    data = response.json()
    assert data["previous"]["chapter_id"] == "ch9"
    assert data["next"] is None


@pytest.mark.asyncio
async def test_list_quizzes(client):
    response = await client.get("/api/v1/quizzes/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10


@pytest.mark.asyncio
async def test_get_quiz(client):
    response = await client.get("/api/v1/quizzes/quiz_ch1")
    assert response.status_code == 200
    data = response.json()
    assert data["quiz_id"] == "quiz_ch1"
    assert len(data["questions"]) == 5


@pytest.mark.asyncio
async def test_submit_quiz(client):
    payload = {"answers": {"q1": 1, "q2": 1, "q3": 2, "q4": 3, "q5": 3}}
    response = await client.post("/api/v1/quizzes/quiz_ch1/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["quiz_id"] == "quiz_ch1"
    assert data["score"] == 100.0
    assert data["passed"] is True
    assert data["correct_answers"] == 5
    assert data["total_questions"] == 5
    assert "q1" in data["feedback"]


@pytest.mark.asyncio
async def test_submit_quiz_partial(client):
    payload = {"answers": {"q1": 0, "q2": 0}}
    response = await client.post("/api/v1/quizzes/quiz_ch1/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["score"] == 0.0
    assert data["correct_answers"] == 0


@pytest.mark.asyncio
async def test_submit_quiz_wrong(client):
    payload = {"answers": {"q1": 0, "q2": 0, "q3": 0, "q4": 0, "q5": 0}}
    response = await client.post("/api/v1/quizzes/quiz_ch1/submit", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["passed"] is False
    assert data["correct_answers"] == 0


@pytest.mark.asyncio
async def test_get_progress(client):
    response = await client.get("/api/v1/progress/test_user")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == "test_user"
    assert data["total_chapters"] == 10
    assert data["completed_chapters"] == 0
    assert data["completion_percentage"] == 0.0


@pytest.mark.asyncio
async def test_update_progress(client):
    payload = {"chapter_id": "ch1", "completed": True, "time_spent": 300, "score": 85}
    response = await client.put("/api/v1/progress/test_user", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["chapter_id"] == "ch1"
    assert data["completed"] is True
    assert data["time_spent"] == 300
    assert data["score"] == 85.0

    response = await client.get("/api/v1/progress/test_user")
    data = response.json()
    assert data["completed_chapters"] == 1
    assert data["completion_percentage"] == 10.0


@pytest.mark.asyncio
async def test_access_free_chapter(client):
    payload = {"user_id": "test_user", "chapter_id": "ch1"}
    response = await client.post("/api/v1/access/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["has_access"] is True
    assert data["is_premium"] is False
    assert data["message"] == "Access granted"


@pytest.mark.asyncio
async def test_access_premium_chapter(client):
    payload = {"user_id": "test_user", "chapter_id": "ch6"}
    response = await client.post("/api/v1/access/check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["has_access"] is False
    assert data["is_premium"] is True
    assert "Premium" in data["message"]


@pytest.mark.asyncio
async def test_search_content(client):
    response = await client.get("/api/v1/search/?q=agent")
    assert response.status_code == 200
    data = response.json()
    assert data["query"] == "agent"
    assert data["total_results"] > 0


@pytest.mark.asyncio
async def test_search_no_results(client):
    response = await client.get("/api/v1/search/?q=xyznonexistent123")
    assert response.status_code == 200
    data = response.json()
    assert data["total_results"] == 0


@pytest.mark.asyncio
async def test_hybrid_phase1_blocked(client):
    payload = {"user_id": "test_user", "feature": "adaptive_path", "data": {}}
    response = await client.post("/api/v1/hybrid/feature", json=payload)
    assert response.status_code == 403
    assert "Phase 2" in response.json()["detail"]
