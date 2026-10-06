
"""Environment-backed application settings."""

from dataclasses import dataclass
import os

from dotenv import load_dotenv

load_dotenv()


def _database_url() -> str:
    value = os.getenv("DATABASE_URL") or "sqlite:///./bliss_mind.db"
    if value.startswith("postgres://"):
        return value.replace("postgres://", "postgresql+psycopg2://", 1)
    if value.startswith("postgresql://") and "+" not in value.split("://", 1)[0]:
        return value.replace("postgresql://", "postgresql+psycopg2://", 1)
    return value


@dataclass(frozen=True)
class Settings:
    database_url: str = _database_url()
    secret_key: str = os.getenv("SECRET_KEY", "change-this-development-secret-before-deploying")
    environment: str = os.getenv("ENVIRONMENT", "development").lower()
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    cors_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS", "http://localhost:3000,http://localhost:5173"
        ).split(",")
        if origin.strip()
    )

    def __post_init__(self) -> None:
        if self.environment in {"production", "prod"} and (
            self.secret_key == "change-this-development-secret-before-deploying"
            or len(self.secret_key) < 32
        ):
            raise ValueError("Production requires a SECRET_KEY of at least 32 characters")


settings = Settings()
