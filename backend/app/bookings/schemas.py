
from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel


class PaymentMethod(str, Enum):
    mobile_money = "mobile_money"
    card = "card"
    cash = "cash"


class BookingCreate(BaseModel):
    session_id: int
    payment_method: PaymentMethod


class BookingSessionSummary(BaseModel):
    id: int
    title: str
    category: str
    start_time: datetime
    duration_minutes: int
    price: Decimal
    instructor: str
    location: str
    image_url: str | None


class BookingResponse(BaseModel):
    id: int
    status: str
    created_at: datetime
    payment_method: PaymentMethod
    session: BookingSessionSummary
