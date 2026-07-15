from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.news_engine.models import Article, ArticleStatus, Category, Source, Tag, article_tag
from src.news_engine.utils.slug import make_slug

# Category aliases for normalization
CATEGORY_ALIASES: dict[str, str] = {
    "bóng đá": "Thể thao",
    "world cup 2026": "Thể thao",
    "cùng luận bàn": "Thời sự",
    "bất động sản": "Kinh doanh",
    "thị trường": "Kinh doanh",
    "góc nhìn": "Thời sự",
    "thời tiết": "Đời sống",
}

# Category color mapping
CATEGORY_COLORS: dict[str, str] = {
    "thoi-su": "#dc2626",
    "the-gioi": "#2563eb",
    "kinh-doanh": "#059669",
    "giai-tri": "#d946ef",
    "the-thao": "#ea580c",
    "giao-duc": "#7c3aed",
    "suc-khoe": "#0891b2",
    "doi-song": "#a16207",
    "phap-luat": "#be123c",
    "khoa-hoc": "#0284c7",
    "cong-nghe": "#1d4ed8",
    "van-hoa": "#0d9488",
    "xe": "#ca8a04",
    "ban-doc": "#4f46e5",
    "tam-su": "#db2777",
    "nha-dat": "#65a30d",
    "du-lich": "#0e7490",
    "so-hoa": "#0369a1",
    "song": "#b45309",
    "an": "#a21caf",
}

# Homepage constants
HOMEPAGE_LATEST_LIMIT = 25
HOMEPAGE_VIDEOS_LIMIT = 6
HOMEPAGE_TOP_TAGS_LIMIT = 15
HOMEPAGE_TOP_CATEGORIES_LIMIT = 6


def _pick_category_color(slug: str) -> str:
    """Pick a color for a category based on its slug."""
    color = CATEGORY_COLORS.get(slug)
    if color:
        return color
    h = hash(slug) & 0xFFFFFF
    hue = h % 360
    return f"hsl({hue}, 50%, 40%)"

STMT_OPTIONS = [
    selectinload(Article.source),
    selectinload(Article.category),
    selectinload(Article.tags),
]


class ArticleRepository:
    """Repository for article-related database operations."""

    def __init__(self, session: AsyncSession):
        self.session = session

    async def _get_or_create_source(self, slug: str, name: str) -> tuple[Source, bool]:
        stmt = select(Source).where(Source.slug == slug)
        result = await self.session.execute(stmt)
        source = result.scalar_one_or_none()
        if source is None:
            source = Source(
                slug=slug,
                name=name or slug,
                base_url=f"https://{slug}.net",
                enabled=True,
            )
            self.session.add(source)
            return source, True
        return source, False

    async def _get_or_create_category(self, name: str) -> tuple[Category | None, bool]:
        if not name:
            return None, False
        name = CATEGORY_ALIASES.get(name.strip(), name.strip())
        slug = make_slug(name)
        stmt = select(Category).where(Category.slug == slug)
        result = await self.session.execute(stmt)
        cat = result.scalar_one_or_none()
        if cat is None:
            cat = Category(name=name, slug=slug, color=_pick_category_color(slug))
            self.session.add(cat)
            return cat, True
        if cat.color is None:
            cat.color = _pick_category_color(slug)
        return cat, False

    async def _get_or_create_tags(self, names: list[str]) -> tuple[list[Tag], bool]:
        tags: list[Tag] = []
        created = False
        for name in names:
            name = name.strip()
            if not name:
                continue
            slug = make_slug(name)
            stmt = select(Tag).where(Tag.slug == slug)
            result = await self.session.execute(stmt)
            tag = result.scalar_one_or_none()
            if tag is None:
                tag = Tag(name=name, slug=slug)
                self.session.add(tag)
                created = True
            tags.append(tag)
        return tags, created

    async def _make_unique_slug(self, base: str) -> str:
        slug = make_slug(base) or "untitled"
        candidate = slug
        counter = 1
        while True:
            stmt = select(func.count()).select_from(Article).where(Article.slug == candidate)
            result = await self.session.execute(stmt)
            if result.scalar() == 0:
                return candidate
            candidate = f"{slug}-{counter}"
            counter += 1

    async def save(self, result) -> Article:
        source, _ = await self._get_or_create_source(result.source, result.source)
        category, _ = await self._get_or_create_category(result.category)
        tags, _ = await self._get_or_create_tags(result.tags)
        slug = await self._make_unique_slug(result.title)
        content_json = [b.model_dump() for b in result.content]

        has_video = any(b.type == "video" for b in result.content)
        video_url = ""
        if has_video:
            for b in result.content:
                if b.type == "video" and b.src:
                    video_url = b.src
                    break

        stmt = select(Article).where(Article.url == result.url)
        existing = await self.session.execute(stmt)
        article = existing.scalar_one_or_none()

        if article:
            article.title = result.title
            article.description = result.description
            article.content = content_json
            article.published_at = result.published_at
            article.category_id = category.id if category else None
            article.author = result.author or article.author
            article.is_video = has_video
            article.video_url = video_url or article.video_url
        else:
            article = Article(
                source_id=source.id,
                url=result.url,
                slug=slug,
                title=result.title,
                description=result.description,
                content=content_json,
                author=result.author or None,
                published_at=result.published_at,
                crawled_at=datetime.now(timezone.utc),
                category_id=category.id if category else None,
                is_video=has_video,
                video_url=video_url or None,
                status=ArticleStatus.ACTIVE,
            )
            self.session.add(article)

        source.last_crawled_at = datetime.now(timezone.utc)
        await self.session.flush()

        if article.id:
            await self.session.execute(
                article_tag.delete().where(article_tag.c.article_id == article.id)
            )
            seen_tag_ids: set[int] = set()
            for tag in tags:
                if tag.id not in seen_tag_ids:
                    await self.session.execute(
                        article_tag.insert().values(article_id=article.id, tag_id=tag.id)
                    )
                    seen_tag_ids.add(tag.id)

        return article

    async def increment_view_count(self, article_id: int) -> None:
        stmt = select(Article).where(Article.id == article_id)
        result = await self.session.execute(stmt)
        article = result.scalar_one_or_none()
        if article:
            article.view_count = (article.view_count or 0) + 1
            await self.session.flush()

    async def get_by_slug(self, slug: str) -> Article | None:
        stmt = (
            select(Article)
            .options(*STMT_OPTIONS)
            .where(Article.slug == slug, Article.status == ArticleStatus.ACTIVE)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_id(self, article_id: int) -> Article | None:
        stmt = (
            select(Article)
            .options(*STMT_OPTIONS)
            .where(Article.id == article_id, Article.status == ArticleStatus.ACTIVE)
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_related_articles(self, slug: str, limit: int = 4) -> list[Article]:
        current = await self.get_by_slug(slug)
        if current is None or current.category_id is None:
            return []

        stmt = (
            select(Article)
            .options(*STMT_OPTIONS)
            .where(
                Article.status == ArticleStatus.ACTIVE,
                Article.category_id == current.category_id,
                Article.id != current.id,
            )
            .order_by(Article.published_at.desc().nullslast())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_prev_next(self, slug: str) -> dict:
        current = await self.get_by_slug(slug)
        if current is None:
            return {"prev_article": None, "next_article": None}

        prev_stmt = (
            select(Article.id, Article.slug, Article.title)
            .where(
                Article.status == ArticleStatus.ACTIVE,
                Article.published_at < current.published_at,
            )
            .order_by(Article.published_at.desc().nullslast())
            .limit(1)
        )
        next_stmt = (
            select(Article.id, Article.slug, Article.title)
            .where(
                Article.status == ArticleStatus.ACTIVE,
                Article.published_at > current.published_at,
            )
            .order_by(Article.published_at.asc().nullslast())
            .limit(1)
        )

        prev_row = (await self.session.execute(prev_stmt)).first()
        next_row = (await self.session.execute(next_stmt)).first()

        return {
            "prev_article": {"slug": prev_row.slug, "title": prev_row.title} if prev_row else None,
            "next_article": {"slug": next_row.slug, "title": next_row.title} if next_row else None,
        }

    async def list_articles(
        self,
        page: int = 1,
        limit: int = 20,
        source: str | None = None,
        category: str | None = None,
    ) -> list[Article]:
        stmt = (
            select(Article)
            .options(*STMT_OPTIONS)
            .where(Article.status == ArticleStatus.ACTIVE)
        )
        if source:
            stmt = stmt.join(Article.source).where(Source.slug == source)
        if category:
            stmt = stmt.join(Article.category).where(Category.slug == category)

        stmt = stmt.order_by(Article.published_at.desc().nullslast())
        stmt = stmt.offset((page - 1) * limit).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count_articles(
        self, source: str | None = None, category: str | None = None
    ) -> int:
        stmt = (
            select(func.count())
            .select_from(Article)
            .where(Article.status == ArticleStatus.ACTIVE)
        )
        if source:
            stmt = stmt.join(Article.source).where(Source.slug == source)
        if category:
            stmt = stmt.join(Article.category).where(Category.slug == category)
        result = await self.session.execute(stmt)
        return result.scalar() or 0

    async def search(self, q: str, page: int = 1, limit: int = 20) -> list[Article]:
        stmt = (
            select(Article)
            .options(*STMT_OPTIONS)
            .where(
                Article.status == ArticleStatus.ACTIVE,
                Article.title.ilike(f"%{q}%"),
            )
            .order_by(Article.published_at.desc().nullslast())
            .offset((page - 1) * limit)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count_search(self, q: str) -> int:
        stmt = (
            select(func.count())
            .select_from(Article)
            .where(
                Article.status == ArticleStatus.ACTIVE,
                Article.title.ilike(f"%{q}%"),
            )
        )
        result = await self.session.execute(stmt)
        return result.scalar() or 0

    async def get_sources(self) -> list[Source]:
        stmt = select(Source).where(Source.enabled)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_categories(self) -> list[Category]:
        stmt = select(Category).order_by(Category.name)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_categories_with_counts(self) -> list[dict]:
        stmt = (
            select(
                Category.id,
                Category.name,
                Category.slug,
                Category.color,
                func.count(Article.id).label("article_count"),
            )
            .outerjoin(
                Article,
                (Article.category_id == Category.id) & (Article.status == ArticleStatus.ACTIVE),
            )
            .group_by(Category.id)
            .order_by(Category.name)
        )
        result = await self.session.execute(stmt)
        return [
            {
                "slug": row.slug,
                "name": row.name,
                "color": row.color or "#111",
                "count": row.article_count,
            }
            for row in result.all()
        ]

    async def get_top_tags(self, limit: int = 20) -> list[dict]:
        stmt = (
            select(
                Tag.id,
                Tag.name,
                Tag.slug,
                func.count(article_tag.c.article_id).label("tag_count"),
            )
            .join(article_tag, Tag.id == article_tag.c.tag_id)
            .group_by(Tag.id)
            .order_by(func.count(article_tag.c.article_id).desc())
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return [{"name": row.name, "slug": row.slug} for row in result.all()]

    async def get_homepage(self, limit_per_cat: int = 5) -> dict:
        """Get homepage data including latest articles, categories, and tags."""
        base_stmt = [
            selectinload(Article.source),
            selectinload(Article.category),
            selectinload(Article.tags),
        ]

        latest_stmt = (
            select(Article)
            .options(*base_stmt)
            .where(Article.status == ArticleStatus.ACTIVE)
            .order_by(Article.published_at.desc().nullslast())
            .limit(HOMEPAGE_LATEST_LIMIT)
        )

        latest_result = await self.session.execute(latest_stmt)
        latest = list(latest_result.scalars().all())

        categories = await self.get_categories_with_counts()

        videos_stmt = (
            select(Article)
            .options(*base_stmt)
            .where(Article.status == ArticleStatus.ACTIVE, Article.is_video)
            .order_by(Article.published_at.desc().nullslast())
            .limit(HOMEPAGE_VIDEOS_LIMIT)
        )
        videos_result = await self.session.execute(videos_stmt)
        videos = list(videos_result.scalars().all())

        tags = await self.get_top_tags(HOMEPAGE_TOP_TAGS_LIMIT)

        top_cat_ids = await self._resolve_category_ids(
            [c["slug"] for c in categories[:HOMEPAGE_TOP_CATEGORIES_LIMIT]]
        )

        cat_article_stmt = (
            select(Article)
            .options(*base_stmt)
            .where(
                Article.status == ArticleStatus.ACTIVE,
                Article.category_id.in_(list(top_cat_ids.values())),
            )
            .order_by(Article.published_at.desc().nullslast())
        )
        cat_articles = list((await self.session.execute(cat_article_stmt)).scalars().all())

        by_cat: dict[str, list[Article]] = {}
        for cat_slug, cat_id in top_cat_ids.items():
            by_cat[cat_slug] = [
                a for a in cat_articles if a.category_id == cat_id
            ][:limit_per_cat]

        return {
            "latest": latest,
            "categories": by_cat,
            "category_meta": categories[:HOMEPAGE_TOP_CATEGORIES_LIMIT],
            "videos": videos,
            "tags": tags,
        }

    async def _resolve_category_ids(self, slugs: list[str]) -> dict[str, int]:
        if not slugs:
            return {}
        stmt = select(Category.id, Category.slug).where(Category.slug.in_(slugs))
        result = await self.session.execute(stmt)
        return {row.slug: row.id for row in result.all()}


