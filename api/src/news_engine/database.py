import sqlalchemy
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from src.news_engine.settings import settings

engine = create_async_engine(
    settings.get_async_database_url(),
    echo=False,
    pool_size=5,
    max_overflow=10,
)

async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""
    pass


async def get_session():
    """Dependency that yields an async database session."""
    async with async_session() as session:
        yield session


async def init_db():
    """Initialize database: create extensions and tables."""
    async with engine.begin() as conn:
        await conn.execute(
            sqlalchemy.text("CREATE EXTENSION IF NOT EXISTS pg_trgm")
        )
        from src.news_engine.models import Base

        await conn.run_sync(Base.metadata.create_all)
