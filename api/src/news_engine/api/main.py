from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.news_engine.api.routers import articles, categories, crawl, home, sources
from src.news_engine.database import async_session, init_db
from src.news_engine.services import CrawlerService
from src.news_engine.settings import settings

logging.basicConfig(
    level=settings.log_level,
    format="%(asctime)s %(levelname)-5s %(message)s",
    datefmt="%H:%M:%S",
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("httpcore").setLevel(logging.WARNING)
logging.getLogger("playwright").setLevel(logging.WARNING)
logger = logging.getLogger(__name__)

WIDTH = 50


def _header(title: str) -> str:
    pad = WIDTH - len(title) - 4
    left = pad // 2
    right = pad - left
    return f"{'─' * left} {title} {'─' * right}"


async def scheduled_crawl():
    logger.info("[crawl] Scheduled crawl started")
    t0 = time.monotonic()
    async with async_session() as session:
        svc = CrawlerService(session)
        results = await svc.crawl_all(limit=20)
    elapsed = time.monotonic() - t0
    total = sum(results.values())
    logger.info("[crawl] Done — %d articles in %.1fs", total, elapsed)


@asynccontextmanager
async def lifespan(app: FastAPI):
    t_start = time.monotonic()

    print()
    print(_header("BOOT"))
    print()

    # ── Database ──
    print(" ├─ Database")
    t0 = time.monotonic()
    await init_db()
    db_time = time.monotonic() - t0
    print(f" │   ✓ Connected ({db_time:.2f}s)")

    # ── Crawl ──
    print(" │")
    print(" ├─ Crawl")
    crawl_results: dict[str, int] = {}
    try:
        async with async_session() as session:
            svc = CrawlerService(session)
            t0 = time.monotonic()
            crawl_results = await svc.crawl_all(limit=20)
            crawl_time = time.monotonic() - t0
        max_name = max(len(n) for n in crawl_results)
        for name, count in crawl_results.items():
            print(f" │   ✓ {name:<{max_name}} {count:>3} articles")
        print(f" │   {'─' * (max_name + 12)}")
        print(f" │   Total: {sum(crawl_results.values())} articles in {crawl_time:.1f}s")
    except Exception as exc:
        print(f" │   ✗ Failed: {exc}")

    # ── Scheduler ──
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        scheduled_crawl,
        "interval",
        minutes=5,
        id="crawl_all",
        replace_existing=True,
    )
    scheduler.start()
    print(" │")
    print(" ├─ Scheduler")
    print(" │   ✓ Every 5 minutes")

    # ── API ──
    print(" │")
    print(" ├─ API")
    print(f" │   ✓ Listening on :{settings.api_port}")

    # ── Done ──
    total_time = time.monotonic() - t_start
    print(" │")
    print(f" └─ Ready in {total_time:.1f}s")
    print()
    print(f"{'─' * WIDTH}")
    print()

    yield

    scheduler.shutdown(wait=False)
    logger.info("[scheduler] Stopped")


app = FastAPI(
    title="TinVit API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home.router, prefix="/api")
app.include_router(sources.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(articles.router, prefix="/api")
app.include_router(crawl.router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok"}
