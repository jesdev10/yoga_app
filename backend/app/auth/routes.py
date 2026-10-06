
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.schemas import AuthResponse, LoginRequest, RegisterRequest
from app.auth.service import authenticate_user, register_user
from app.core.database import get_db
from app.core.security import create_access_token
from app.users.models import User
from app.users.schemas import UserPublic

router = APIRouter(prefix="/api/auth", tags=["authentication"])


def _auth_response(user: User) -> AuthResponse:
    return AuthResponse(
        access_token=create_access_token(str(user.id)), user=UserPublic.model_validate(user)
    )


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = register_user(
        db, full_name=payload.full_name, email=str(payload.email), password=payload.password
    )
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email is already registered") from exc
    return _auth_response(user)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    user = authenticate_user(db, str(payload.email), payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    return _auth_response(user)


@router.get("/me", response_model=UserPublic)
def current_user(user: User = Depends(get_current_user)) -> User:
    return user
