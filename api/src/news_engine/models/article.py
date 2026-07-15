import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.news_engine.database import Base


class ArticleStatus(enum.Enum):
    ACTIVE = "active"
    HIDDEN = "hidden"


class Article(Base):
    __tablename__ = "articles"
    __table_args__ = (
        Index("ix_articles_status_published", "status", "published_at", postgresql_using="btree"),
        Index("ix_articles_category_status", "category_id", "status"),
        Index("ix_articles_source_status", "source_id", "status"),
        Index(
            "ix_articles_title_trgm", "title",
            postgresql_using="gin",
            postgresql_ops={"title": "gin_trgm_ops"},
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    source_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sources.id", ondelete="CASCADE"), nullable=False
    )
    url: Mapped[str] = mapped_column(String(2048), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(300), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[list[dict] | None] = mapped_column(JSONB, nullable=True, default=list)
    author: Mapped[str | None] = mapped_column(String(200), nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, index=True
    )
    crawled_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True, onupdate=func.now()
    )
    view_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    is_video: Mapped[bool] = mapped_column(default=False, nullable=False)
    video_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    category_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[ArticleStatus] = mapped_column(
        Enum(ArticleStatus), default=ArticleStatus.ACTIVE, nullable=False
    )

    source = relationship("Source", back_populates="articles")
    category = relationship("Category", back_populates="articles")
    tags = relationship("Tag", secondary="article_tags", back_populates="articles")
