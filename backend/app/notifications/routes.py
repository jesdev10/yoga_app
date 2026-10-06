
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.notifications.schemas import NotificationResponse
from app.notifications.service import list_notifications, mark_read
from app.users.models import User

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("/me", response_model=list[NotificationResponse])
def my_notifications(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
) -> list:
    return list_notifications(db, user.id)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    notification = mark_read(db, notification_id, user.id)
    if notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notification
