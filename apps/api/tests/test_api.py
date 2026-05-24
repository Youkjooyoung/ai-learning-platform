from httpx import ASGITransport, AsyncClient

from app.db.session import engine
from app.main import app
from app.models import Base


async def reset_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


async def test_note_ai_flow():
    await reset_database()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        register = await client.post(
            "/auth/register",
            json={"email": "user@example.com", "password": "password123"},
        )
        assert register.status_code in (201, 409)

        login = await client.post(
            "/auth/login",
            data={"username": "user@example.com", "password": "password123"},
        )
        assert login.status_code == 200
        token = login.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        created = await client.post(
            "/notes",
            headers=headers,
            json={
                "title": "FastAPI",
                "content": "FastAPI는 Python 타입 힌트 기반 API 프레임워크다.",
                "tags": ["backend", "api"],
            },
        )
        assert created.status_code == 201
        note_id = created.json()["id"]

        summary = await client.post(f"/notes/{note_id}/summarize", headers=headers)
        assert summary.status_code == 200
        assert summary.json()["provider"] == "mock"

        dashboard = await client.get("/dashboard/summary", headers=headers)
        assert dashboard.status_code == 200
        assert dashboard.json()["total_notes"] >= 1
