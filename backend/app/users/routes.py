
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.core.database import get_db
from app.users.models import User
from app.users.schemas import ProfileUpdate, UserPublic

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def read_profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.patch("/me", response_model=UserPublic)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> User:
    changes = payload.model_dump(exclude_unset=True)
    if "email" in changes and changes["email"] is not None:
        changes["email"] = str(changes["email"]).lower()
    for field, value in changes.items():
        if value is not None:
            setattr(current_user, field, value)
    try:
        db.commit()
        db.refresh(current_user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email is already registered") from exc
    return current_user
