
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.wellness_articles.models import WellnessArticle


def list_articles(db: Session) -> list[WellnessArticle]:
    return list(db.scalars(select(WellnessArticle).order_by(WellnessArticle.published_at.desc())))


def get_article(db: Session, slug: str) -> WellnessArticle | None:
    return db.scalar(select(WellnessArticle).where(WellnessArticle.slug == slug))
