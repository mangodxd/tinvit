from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.news_engine.database import get_session
from src.news_engine.services import CrawlerService

router = APIRouter(prefix="/crawl", tags=["crawl"])


@router.post("")
async def crawl(
    source: str | None = Query(None),
    limit: int = Query(20, ge=1, le=200),
    session: AsyncSession = Depends(get_session),
):
    svc = CrawlerService(session)
    if source:
        count = await svc.crawl_source(source, limit)
        return {"source": source, "crawled": count}
    results = await svc.crawl_all(limit)
    return results
