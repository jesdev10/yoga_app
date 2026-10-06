
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class SessionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: str
    description: str
    instructor: str
    location: str
    start_time: datetime
    duration_minutes: int
    price: Decimal
    capacity: int
    booked_count: int
    spots_left: int
    image_url: str | None
