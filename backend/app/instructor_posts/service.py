
from sqlalchemy.orm import Session

from app.instructor_posts.models import InstructorApplication
from app.instructor_posts.schemas import InstructorApplicationCreate


def submit_application(
    db: Session, payload: InstructorApplicationCreate
) -> InstructorApplication:
    application = InstructorApplication(
        full_name=payload.full_name.strip(),
        email=str(payload.email).lower(),
        phone=payload.phone.strip(),
        discipline=payload.discipline.strip(),
        experience_years=payload.experience_years,
        bio=payload.bio.strip(),
        cv_url=str(payload.cv_url) if payload.cv_url else None,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application
