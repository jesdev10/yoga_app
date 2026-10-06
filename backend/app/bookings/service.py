
from sqlalchemy import select, update
from sqlalchemy.orm import Session, joinedload

from app.bookings.models import Booking
from app.notifications.models import Notification
from app.sessions.models import WellnessSession


class BookingConflict(Exception):
    """The requested session is full or the booking cannot be changed."""


class BookingSessionNotFound(Exception):
    """No session exists with the requested identifier."""


def create_booking(
    db: Session, *, user_id: int, session_id: int, payment_method: str
) -> Booking:
    # A conditional write makes capacity enforcement atomic across concurrent requests.
    result = db.execute(
        update(WellnessSession)
        .where(
            WellnessSession.id == session_id,
            WellnessSession.booked_count < WellnessSession.capacity,
        )
        .values(booked_count=WellnessSession.booked_count + 1)
    )
    if result.rowcount != 1:
        db.rollback()
        if db.get(WellnessSession, session_id) is None:
            raise BookingSessionNotFound("Session not found")
        raise BookingConflict("No spots are available for this session")
    session = db.get(WellnessSession, session_id)
    booking = Booking(
        user_id=user_id, session_id=session_id, payment_method=payment_method, status="confirmed"
    )
    db.add(booking)
    db.flush()
    db.add(
        Notification(
            user_id=user_id,
            title="Booking confirmed",
            message=f"Your booking for {session.title} is confirmed.",
            booking_id=booking.id,
        )
    )
    db.commit()
    return db.scalar(
        select(Booking).options(joinedload(Booking.session)).where(Booking.id == booking.id)
    )


def list_user_bookings(db: Session, user_id: int) -> list[Booking]:
    return list(
        db.scalars(
            select(Booking)
            .options(joinedload(Booking.session))
            .where(Booking.user_id == user_id)
            .order_by(Booking.created_at.desc())
        )
    )


def cancel_booking(db: Session, *, booking_id: int, user_id: int) -> Booking | None:
    booking = db.scalar(
        select(Booking)
        .options(joinedload(Booking.session))
        .where(Booking.id == booking_id, Booking.user_id == user_id)
    )
    if booking is None:
        return None
    if booking.status != "confirmed":
        raise BookingConflict("Booking is already cancelled")

    changed = db.execute(
        update(Booking)
        .where(Booking.id == booking_id, Booking.user_id == user_id, Booking.status == "confirmed")
        .values(status="cancelled")
    )
    if changed.rowcount != 1:
        db.rollback()
        raise BookingConflict("Booking is already cancelled")
    db.execute(
        update(WellnessSession)
        .where(WellnessSession.id == booking.session_id, WellnessSession.booked_count > 0)
        .values(booked_count=WellnessSession.booked_count - 1)
    )
    db.add(
        Notification(
            user_id=user_id,
            title="Booking cancelled",
            message=f"Your booking for {booking.session.title} has been cancelled.",
            booking_id=booking.id,
        )
    )
    db.commit()
    return db.scalar(
        select(Booking)
        .options(joinedload(Booking.session))
        .where(Booking.id == booking_id)
    )
