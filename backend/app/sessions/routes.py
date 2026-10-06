
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.sessions.schemas import SessionResponse
from app.sessions.service import list_sessions

router = APIRouter(prefix="/api/sessions", tags=["sessions"])


@router.get("", response_model=list[SessionResponse])
def get_sessions(
    q: str | None = Query(default=None, max_length=100),
    category: str | None = Query(default=None, max_length=80),
    db: Session = Depends(get_db),
) -> list[dict]:
    return [
        {**session.__dict__, "spots_left": max(0, session.capacity - session.booked_count)}
        for session in list_sessions(db, query=q, category=category)
    ]
