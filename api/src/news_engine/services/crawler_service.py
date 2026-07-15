from __future__ import annotations

import asyncio
import logging
import time

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from src.news_engine.crawlers import SPIDERS
from src.news_engine.database import async_session
from src.news_engine.repositories import ArticleRepository

logger = logging.getLogger(__name__)


class CrawlerService:
    """Service for crawling news articles from various sources."""

    def __init__(self, session: AsyncSession):
        self.repo = ArticleRepository(session)

    async def crawl_all(self, limit: int = 20) -> dict[str, int]:
        """Crawl all registered sources and return article counts."""
        results = await asyncio.gather(
            *(self._crawl_source_isolated(name, limit) for name in SPIDERS),
            return_exceptions=True,
        )
        return {
            name: result if isinstance(result, int) else 0
            for name, result in zip(SPIDERS.keys(), results)
        }

    async def _crawl_source_isolated(self, source: str, limit: int = 20) -> int:
        async with async_session() as session:
            repo = ArticleRepository(session)
            spider_cls = SPIDERS.get(source)
            if spider_cls is None:
                raise ValueError(f"Unknown source: {source}")

            spider = spider_cls()
            t0 = time.monotonic()
            crawl_results = await spider.crawl(limit=limit)
            elapsed = time.monotonic() - t0
            logger.info(
                "[crawl] %s — fetched %d in %.1fs",
                source, len(crawl_results), elapsed,
            )

            saved = 0
            for result in crawl_results:
                try:
                    await repo.save(result)
                    saved += 1
                except SQLAlchemyError as exc:
                    logger.warning("[crawl] %s — failed to save: %s", source, exc)
                    await session.rollback()

            try:
                await session.commit()
            except SQLAlchemyError as exc:
                await session.rollback()
                logger.warning(
                    "[crawl] %s — batch commit failed (%s), falling back to per-article",
                    source, exc,
                )
                saved = 0
                for result in crawl_results:
                    try:
                        await repo.save(result)
                        await session.commit()
                        saved += 1
                    except SQLAlchemyError:
                        await session.rollback()

            await spider.aclose()
            return saved

    async def crawl_source(self, source: str, limit: int = 20) -> int:
        spider_cls = SPIDERS.get(source)
        if spider_cls is None:
            raise ValueError(f"Unknown source: {source}")

        spider = spider_cls()
        t0 = time.monotonic()
        crawl_results = await spider.crawl(limit=limit)
        elapsed = time.monotonic() - t0
        logger.info(
            "[crawl] %s — fetched %d in %.1fs",
            source, len(crawl_results), elapsed,
        )

        saved = 0
        for result in crawl_results:
            try:
                await self.repo.save(result)
                saved += 1
            except SQLAlchemyError as exc:
                logger.warning("[crawl] %s — failed to save: %s", source, exc)

        try:
            await self.repo.session.commit()
        except SQLAlchemyError as exc:
            await self.repo.session.rollback()
            logger.warning(
                "[crawl] %s — batch commit failed (%s), falling back to per-article",
                source, exc,
            )
            saved = 0
            for result in crawl_results:
                try:
                    await self.repo.save(result)
                    await self.repo.session.commit()
                    saved += 1
                except SQLAlchemyError:
                    await self.repo.session.rollback()

        await spider.aclose()
        return saved
