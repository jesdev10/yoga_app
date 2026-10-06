from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main
from app.core import database


@pytest.fixture()
def client(monkeypatch: pytest.MonkeyPatch) -> Generator[TestClient, None, None]:
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    test_session = sessionmaker(
        bind=test_engine, autoflush=False, autocommit=False, expire_on_commit=False
    )
    monkeypatch.setattr(database, "engine", test_engine)
    monkeypatch.setattr(database, "SessionLocal", test_session)
    monkeypatch.setattr(main, "engine", test_engine)
    monkeypatch.setattr(main, "SessionLocal", test_session)
    with TestClient(main.app) as test_client:
        yield test_client
    test_engine.dispose()


def register(client: TestClient, email: str = "member@example.com") -> tuple[dict, str]:
    response = client.post(
        "/api/auth/register",
        json={"full_name": "Test Member", "email": email, "password": "mindful-pass-123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert set(data) == {"access_token", "token_type", "user"}
    return data["user"], data["access_token"]


def test_auth_registration_login_and_current_user(client: TestClient) -> None:
    user, token = register(client)
    assert set(user) == {"id", "full_name", "email", "role"}
    assert user["role"] == "user"
    assert client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"}).json() == user

    login = client.post(
        "/api/auth/login",
        json={"email": "MEMBER@example.com", "password": "mindful-pass-123"},
    )
    assert login.status_code == 200
    assert login.json()["user"] == user
    assert client.post(
        "/api/auth/login", json={"email": "member@example.com", "password": "wrong"}
    ).status_code == 401
    assert client.get("/api/auth/me").status_code == 401
    assert client.post(
        "/api/auth/register",
        json={"full_name": "Duplicate", "email": "MEMBER@example.com", "password": "another-pass"},
    ).status_code == 409
    assert client.get("/").json() == {"message": "BLISS MIND Backend is running"}


def test_session_catalog_booking_capacity_cancel_and_notifications(client: TestClient) -> None:
    _, token = register(client)
    headers = {"Authorization": f"Bearer {token}"}
    sessions = client.get("/api/sessions").json()
    assert len(sessions) >= 1
    session = sessions[0]
    assert set(session) == {
        "id", "title", "category", "description", "instructor", "location", "start_time",
        "duration_minutes", "price", "capacity", "booked_count", "spots_left", "image_url",
    }

    with database.SessionLocal() as db:
        row = db.get(main.WellnessSession, session["id"])
        row.capacity = row.booked_count + 1
        db.commit()

    booking_response = client.post(
        "/api/bookings",
        headers=headers,
        json={"session_id": session["id"], "payment_method": "mobile_money"},
    )
    assert booking_response.status_code == 201
    booking = booking_response.json()
    assert booking["status"] == "confirmed"
    assert booking["payment_method"] == "mobile_money"
    assert booking["session"]["id"] == session["id"]

    assert client.post(
        "/api/bookings",
        headers=headers,
        json={"session_id": session["id"], "payment_method": "cash"},
    ).status_code == 409
    assert len(client.get("/api/bookings/me", headers=headers).json()) == 1
    notifications = client.get("/api/notifications/me", headers=headers).json()
    assert len(notifications) == 1
    notification_id = notifications[0]["id"]
    assert client.patch(
        f"/api/notifications/{notification_id}/read", headers=headers
    ).json()["is_read"] is True

    cancelled = client.patch(f"/api/bookings/{booking['id']}/cancel", headers=headers)
    assert cancelled.status_code == 200
    assert cancelled.json()["status"] == "cancelled"
    assert client.patch(f"/api/bookings/{booking['id']}/cancel", headers=headers).status_code == 409


def test_booking_and_notification_are_private_to_their_owner(client: TestClient) -> None:
    _, owner_token = register(client, "owner@example.com")
    _, other_token = register(client, "other@example.com")
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    other_headers = {"Authorization": f"Bearer {other_token}"}
    session_id = client.get("/api/sessions").json()[0]["id"]
    booking = client.post(
        "/api/bookings",
        headers=owner_headers,
        json={"session_id": session_id, "payment_method": "cash"},
    ).json()
    notification_id = client.get("/api/notifications/me", headers=owner_headers).json()[0]["id"]

    assert client.get("/api/bookings/me", headers=other_headers).json() == []
    assert client.patch(
        f"/api/bookings/{booking['id']}/cancel", headers=other_headers
    ).status_code == 404
    assert client.patch(
        f"/api/notifications/{notification_id}/read", headers=other_headers
    ).status_code == 404
    assert client.post(
        "/api/bookings",
        headers=owner_headers,
        json={"session_id": session_id, "payment_method": "gateway"},
    ).status_code == 422
    assert client.post(
        "/api/bookings",
        headers=owner_headers,
        json={"session_id": 999999, "payment_method": "cash"},
    ).status_code == 404


def test_articles_and_public_instructor_application(client: TestClient) -> None:
    articles = client.get("/api/articles").json()
    assert articles
    assert set(articles[0]) == {
        "id", "title", "slug", "summary", "body", "category", "author",
        "published_at", "image_url",
    }
    detail = client.get(f"/api/articles/{articles[0]['slug']}")
    assert detail.status_code == 200
    assert detail.json()["id"] == articles[0]["id"]
    assert client.get("/api/articles/no-such-article").status_code == 404

    application = client.post(
        "/api/instructor-applications",
        json={
            "full_name": "Yoga Teacher",
            "email": "teacher@example.com",
            "phone": "+1 555 0100",
            "discipline": "Yoga",
            "experience_years": 4,
            "bio": "I teach inclusive movement and mindful breathing.",
            "cv_url": "https://example.com/cv",
        },
    )
    assert application.status_code == 201
    assert application.json()["status"] == "pending"
