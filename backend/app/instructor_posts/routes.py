
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.instructor_posts.schemas import (
    InstructorApplicationCreate,
    InstructorApplicationResponse,
)
from app.instructor_posts.service import submit_application

router = APIRouter(prefix="/api/instructor-applications", tags=["instructor applications"])


@router.post("", response_model=InstructorApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply(
    payload: InstructorApplicationCreate, db: Session = Depends(get_db)
) -> InstructorApplicationResponse:
    return submit_application(db, payload)
