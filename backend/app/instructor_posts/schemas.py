
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, HttpUrl


class InstructorApplicationCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=40)
    discipline: str = Field(min_length=1, max_length=100)
    experience_years: int = Field(ge=0, le=80)
    bio: str = Field(min_length=20, max_length=5000)
    cv_url: HttpUrl | None = None


class InstructorApplicationResponse(BaseModel):
    id: int
    status: str
    submitted_at: datetime
