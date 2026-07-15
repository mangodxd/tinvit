from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.news_engine.database import get_session
from src.news_engine.services import ArticleService

router = APIRouter(tags=["home"])


@router.get("/home")
async def homepage(session: AsyncSession = Depends(get_session)):
    svc = ArticleService(session)
    return await svc.get_homepage()
