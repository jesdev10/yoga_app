
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.users.models import User
from app.users.service import get_user_by_email


def register_user(db: Session, *, full_name: str, email: str, password: str) -> User:
    user = User(
        full_name=full_name.strip(),
        email=email.lower(),
        hashed_password=hash_password(password),
    )
    db.add(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if user is None or not verify_password(password, user.hashed_password):
        return None
    return user
