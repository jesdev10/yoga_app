
from sqlalchemy import select, update
from sqlalchemy.orm import Session

from app.notifications.models import Notification


def list_notifications(db: Session, user_id: int) -> list[Notification]:
    return list(
        db.scalars(
            select(Notification)
            .where(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
        )
    )


def mark_read(db: Session, notification_id: int, user_id: int) -> Notification | None:
    notification = db.scalar(
        select(Notification).where(
            Notification.id == notification_id, Notification.user_id == user_id
        )
    )
    if notification is None:
        return None
    if not notification.is_read:
        db.execute(
            update(Notification)
            .where(Notification.id == notification_id, Notification.user_id == user_id)
            .values(is_read=True)
        )
        db.commit()
        db.refresh(notification)
    return notification
