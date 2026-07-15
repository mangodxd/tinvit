import asyncio
import sys
import uvicorn

from src.news_engine.settings import settings

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

if __name__ == "__main__":
    uvicorn.run(
        "src.news_engine.api.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
    )
