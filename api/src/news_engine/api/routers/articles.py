from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.news_engine.database import get_session
from src.news_engine.services import ArticleService

router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("")
async def list_articles(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    source: str | None = None,
    category: str | None = None,
    session: AsyncSession = Depends(get_session),
):
    svc = ArticleService(session)
    return await svc.list_articles(page, limit, source, category)


@router.get("/search")
async def search_articles(
    q: str = Query(..., min_length=1),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    svc = ArticleService(session)
    return await svc.search(q, page, limit)


@router.get("/{slug_or_id}/related")
async def get_related_articles(
    slug_or_id: str,
    limit: int = Query(4, ge=1, le=20),
    session: AsyncSession = Depends(get_session),
):
    svc = ArticleService(session)
    return await svc.get_related_articles(slug_or_id, limit)


@router.get("/{slug_or_id}")
async def get_article(
    slug_or_id: str,
    session: AsyncSession = Depends(get_session),
):
    svc = ArticleService(session)
    article = await svc.get_article(slug_or_id)
    if article is None:
        from fastapi.responses import JSONResponse
        return JSONResponse(status_code=404, content={"error": "Not found"})
    return article
