
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.bookings.models import Booking
from app.bookings.schemas import BookingCreate, BookingResponse
from app.bookings.service import (
    BookingConflict,
    BookingSessionNotFound,
    cancel_booking,
    create_booking,
    list_user_bookings,
)
from app.core.database import get_db
from app.users.models import User

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def _response(booking: Booking) -> dict:
    session = booking.session
    return {
        "id": booking.id,
        "status": booking.status,
        "created_at": booking.created_at,
        "payment_method": booking.payment_method,
        "session": {
            "id": session.id,
            "title": session.title,
            "category": session.category,
            "start_time": session.start_time,
            "duration_minutes": session.duration_minutes,
            "price": session.price,
            "instructor": session.instructor,
            "location": session.location,
            "image_url": session.image_url,
        },
    }


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def book_session(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    try:
        booking = create_booking(
            db,
            user_id=user.id,
            session_id=payload.session_id,
            payment_method=payload.payment_method.value,
        )
    except BookingSessionNotFound as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except BookingConflict as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    return _response(booking)


@router.get("/me", response_model=list[BookingResponse])
def my_bookings(db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> list[dict]:
    return [_response(booking) for booking in list_user_bookings(db, user.id)]


@router.patch("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_my_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> dict:
    try:
        booking = cancel_booking(db, booking_id=booking_id, user_id=user.id)
    except BookingConflict as exc:
        raise HTTPException(status_code=409, detail=str(exc)) from exc
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    return _response(booking)
