
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class InstructorApplication(Base):
    __tablename__ = "instructor_applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    full_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(320), nullable=False, index=True)
    phone: Mapped[str] = mapped_column(String(40), nullable=False)
    discipline: Mapped[str] = mapped_column(String(100), nullable=False)
    experience_years: Mapped[int] = mapped_column(Integer, nullable=False)
    bio: Mapped[str] = mapped_column(Text, nullable=False)
    cv_url: Mapped[str | None] = mapped_column(String(1000))
    status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
