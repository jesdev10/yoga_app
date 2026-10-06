from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from decimal import Decimal

from fastapi import FastAPI
from sqlalchemy import select

from app.auth.routes import router as auth_router
from app.bookings.routes import router as bookings_router
from app.core.database import Base, SessionLocal, engine
from app.core.logging import configure_logging
from app.instructor_posts.routes import router as instructor_applications_router
from app.middleware.cors import configure_cors
from app.middleware.error_handler import configure_error_handling
from app.notifications.routes import router as notifications_router
from app.sessions.models import WellnessSession
from app.sessions.routes import router as sessions_router
from app.wellness_articles.models import WellnessArticle
from app.wellness_articles.routes import router as articles_router
from app.users.routes import router as users_router


def initialize_database() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.scalar(select(WellnessSession.id).limit(1)) is None:
            now = datetime.now(timezone.utc)
            db.add_all(
                [
                    WellnessSession(
                        title="Sunrise Flow",
                        category="Yoga",
                        description="A welcoming flow to build mobility and start your day mindfully.",
                        instructor="Amara N.",
                        location="Bliss Mind Studio",
                        start_time=now + timedelta(days=1),
                        duration_minutes=60,
                        price=Decimal("18.00"),
                        capacity=16,
                        booked_count=0,
                        image_url=None,
                    ),
                    WellnessSession(
                        title="Guided Meditation",
                        category="Meditation",
                        description="A calming guided practice for focus, breath, and relaxation.",
                        instructor="Kofi A.",
                        location="Garden Room",
                        start_time=now + timedelta(days=2),
                        duration_minutes=45,
                        price=Decimal("12.00"),
                        capacity=12,
                        booked_count=0,
                        image_url=None,
                    ),
                    WellnessSession(
                        title="Gentle Restorative Yoga",
                        category="Yoga",
                        description="Supported poses and slow breathing suitable for all levels.",
                        instructor="Nia B.",
                        location="Bliss Mind Studio",
                        start_time=now + timedelta(days=3),
                        duration_minutes=75,
                        price=Decimal("20.00"),
                        capacity=14,
                        booked_count=0,
                        image_url=None,
                    ),
                ]
            )
        if db.scalar(select(WellnessArticle.id).limit(1)) is None:
            db.add_all(
                [
                    WellnessArticle(
                        title="Building a Mindful Morning",
                        slug="building-a-mindful-morning",
                        summary="Simple ways to bring a little more intention to the start of your day.",
                        body=(
                            "A mindful morning does not need to be complicated. Begin with a few "
                            "slow breaths, drink some water, and choose one small intention for "
                            "the day. A short stretch or quiet moment can help you arrive in the "
                            "present before the day gathers pace."
                        ),
                        category="Mindfulness",
                        author="Bliss Mind Team",
                        image_url=None,
                    ),
                    WellnessArticle(
                        title="Rest Is Part of Your Practice",
                        slug="rest-is-part-of-your-practice",
                        summary="Why recovery and gentle movement belong in a balanced wellness routine.",
                        body=(
                            "Rest is not a reward for doing enough; it is part of caring for "
                            "yourself. Balance active movement with restorative practices, and "
                            "pay attention to what your body needs from day to day."
                        ),
                        category="Wellness",
                        author="Bliss Mind Team",
                        image_url=None,
                    ),
                ]
            )
        db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database()
    yield


configure_logging()
app = FastAPI(title="BLISS MIND API", version="1.0.0", lifespan=lifespan)
configure_cors(app)
configure_error_handling(app)
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(sessions_router)
app.include_router(bookings_router)
app.include_router(instructor_applications_router)
app.include_router(articles_router)
app.include_router(notifications_router)


@app.get("/")
def home():
    return {
        "message": "BLISS MIND Backend is running"
    }
