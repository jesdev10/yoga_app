
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.wellness_articles.schemas import ArticleResponse
from app.wellness_articles.service import get_article, list_articles

router = APIRouter(prefix="/api/articles", tags=["articles"])


@router.get("", response_model=list[ArticleResponse])
def articles(db: Session = Depends(get_db)) -> list:
    return list_articles(db)


@router.get("/{slug}", response_model=ArticleResponse)
def article_detail(slug: str, db: Session = Depends(get_db)):
    article = get_article(db, slug)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
