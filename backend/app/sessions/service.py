
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.sessions.models import WellnessSession


def list_sessions(
    db: Session, query: str | None = None, category: str | None = None
) -> list[WellnessSession]:
    statement = select(WellnessSession).order_by(WellnessSession.start_time)
    if query:
        term = f"%{query.strip()}%"
        statement = statement.where(
            WellnessSession.title.ilike(term)
            | WellnessSession.description.ilike(term)
            | WellnessSession.instructor.ilike(term)
        )
    if category:
        statement = statement.where(WellnessSession.category.ilike(category.strip()))
    return list(db.scalars(statement))
