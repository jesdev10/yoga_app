
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ArticleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: str
    summary: str
    body: str
    category: str
    author: str
    published_at: datetime
    image_url: str | None
