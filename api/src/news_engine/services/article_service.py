from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from src.news_engine.repositories import ArticleRepository


@dataclass
class ArticleCardDTO:
    slug: str
    title: str
    excerpt: str
    image_url: str | None
    category_name: str
    category_slug: str | None
    source_name: str
    published_at: str | None
    is_video: bool = False
    video_url: str | None = None


@dataclass
class ArticleDetailDTO:
    id: int
    title: str
    slug: str
    description: str
    image_url: str
    content: list[dict]
    category_name: str
    category_slug: str
    source_name: str
    source_slug: str
    source_url: str
    published_at: str | None
    updated_at: str | None
    view_count: int
    tags: list[dict]
    is_video: bool
    video_url: str | None
    author: str | None = None


class ArticleService:
    """Service for article-related business logic."""

    def __init__(self, session: AsyncSession):
        self.repo = ArticleRepository(session)

    @staticmethod
    def _extract_image(article) -> str:
        """Extract the first image URL from article content."""
        if article.content:
            for block in article.content:
                if block.get("type") == "image" and block.get("src"):
                    return block["src"]
        return ""

    @staticmethod
    def _to_card(article) -> ArticleCardDTO:
        image = ArticleService._extract_image(article)

        return ArticleCardDTO(
            slug=article.slug,
            title=article.title,
            excerpt=article.description or "",
            image_url=image or None,
            category_name=article.category.name if article.category else "Khác",
            category_slug=article.category.slug if article.category else None,
            source_name=article.source.name if article.source else "",
            published_at=article.published_at.isoformat() if article.published_at else None,
            is_video=article.is_video if hasattr(article, "is_video") else False,
            video_url=article.video_url if hasattr(article, "video_url") else None,
        )

    async def get_article(self, slug: str) -> ArticleDetailDTO | None:
        article = await self.repo.get_by_slug(slug)
        if article is None:
            try:
                article = await self.repo.get_by_id(int(slug))
            except ValueError:
                pass
        if article is None:
            return None

        return ArticleDetailDTO(
            id=article.id,
            title=article.title,
            slug=article.slug,
            description=article.description or "",
            image_url=self._extract_image(article),
            content=article.content or [],
            category_name=article.category.name if article.category else "Khác",
            category_slug=article.category.slug if article.category else "",
            source_name=article.source.name if article.source else "",
            source_slug=article.source.slug if article.source else "",
            source_url=(
                article.source.website_url or article.source.base_url
                if article.source
                else ""
            ),
            published_at=article.published_at.isoformat() if article.published_at else None,
            updated_at=article.updated_at.isoformat() if article.updated_at else None,
            view_count=article.view_count or 0,
            tags=[{"name": t.name, "slug": t.slug} for t in (article.tags or [])],
            is_video=article.is_video if hasattr(article, "is_video") else False,
            video_url=article.video_url if hasattr(article, "video_url") else None,
            author=article.author if hasattr(article, "author") else None,
        )

    async def get_related_articles(self, slug: str, limit: int = 4) -> list[ArticleCardDTO]:
        articles = await self.repo.get_related_articles(slug, limit)
        return [self._to_card(a) for a in articles]

    async def list_articles(
        self, page: int = 1, limit: int = 20, source: str | None = None, category: str | None = None
    ) -> dict:
        articles = await self.repo.list_articles(page, limit, source, category)
        total = await self.repo.count_articles(source, category)
        total_pages = max(1, -(-total // limit))

        category_meta = None
        if category:
            cats = await self.repo.get_categories_with_counts()
            for c in cats:
                if c["slug"] == category:
                    category_meta = {
                        "slug": c["slug"],
                        "name": c["name"],
                        "color": c["color"],
                        "article_count": c["count"],
                    }
                    break

        return {
            "articles": [self._to_card(a) for a in articles],
            "total": total,
            "page": page,
            "page_size": limit,
            "total_pages": total_pages,
            "category": category_meta,
        }

    async def search(self, q: str, page: int = 1, limit: int = 20) -> dict:
        articles = await self.repo.search(q, page, limit)
        total = await self.repo.count_search(q)
        total_pages = max(1, -(-total // limit))
        return {
            "results": [self._to_card(a) for a in articles],
            "total": total,
            "page": page,
            "page_size": limit,
            "total_pages": total_pages,
        }

    async def get_homepage(self) -> dict:
        data = await self.repo.get_homepage()

        latest = data["latest"]

        seen_urls: set[str] = set()
        deduped: list = []
        for a in latest:
            if a.url not in seen_urls:
                seen_urls.add(a.url)
                deduped.append(a)
        latest = deduped

        hero = self._to_card(latest[0]) if latest else None
        hero_secondary = [self._to_card(a) for a in latest[1:3]]

        magazine_featured = self._to_card(latest[3]) if len(latest) > 3 else None
        magazine_list = [self._to_card(a) for a in latest[4:8]]

        sidebar_recent = [self._to_card(a) for a in latest[9:15]]
        tags = data.get("tags", [])

        categories_meta = data.get("category_meta", [])
        category_articles = {
            slug: [self._to_card(a) for a in articles]
            for slug, articles in data.get("categories", {}).items()
        }

        return {
            "hero": hero,
            "hero_secondary": hero_secondary,
            "featured": {
                "article": magazine_featured,
                "list": magazine_list,
            },
            "latest": sidebar_recent,
            "videos": [self._to_card(a) for a in data.get("videos", [])],
            "categories": {
                "meta": categories_meta,
                "articles": category_articles,
            },
            "tags": tags,
        }

    async def get_sources(self) -> list[dict]:
        sources = await self.repo.get_sources()
        return [
            {
                "slug": s.slug,
                "name": s.name,
                "logo_url": s.logo_url or "",
                "enabled": s.enabled,
            }
            for s in sources
        ]

    async def get_categories(self) -> list[dict]:
        categories = await self.repo.get_categories()
        return [{"slug": c.slug, "name": c.name} for c in categories]
