from src.news_engine.models import Article, ArticleStatus, Category, Source, Tag


class TestArticleStatus:
    def test_active_value(self):
        assert ArticleStatus.ACTIVE.value == "active"

    def test_hidden_value(self):
        assert ArticleStatus.HIDDEN.value == "hidden"


class TestSource:
    def test_tablename(self):
        assert Source.__tablename__ == "sources"

    def test_fields(self):
        source = Source(
            name="VnExpress",
            slug="vnexpress",
            base_url="https://vnexpress.net",
            enabled=True,
        )
        assert source.name == "VnExpress"
        assert source.slug == "vnexpress"
        assert source.base_url == "https://vnexpress.net"
        assert source.enabled is True


class TestCategory:
    def test_tablename(self):
        assert Category.__tablename__ == "categories"

    def test_fields(self):
        category = Category(name="Thời sự", slug="thoi-su")
        assert category.name == "Thời sự"
        assert category.slug == "thoi-su"


class TestTag:
    def test_tablename(self):
        assert Tag.__tablename__ == "tags"

    def test_fields(self):
        tag = Tag(name="Breaking", slug="breaking")
        assert tag.name == "Breaking"
        assert tag.slug == "breaking"


class TestArticle:
    def test_tablename(self):
        assert Article.__tablename__ == "articles"

    def test_fields(self):
        article = Article(
            source_id=1,
            url="https://example.com",
            slug="test-article",
            title="Test Article",
            status=ArticleStatus.ACTIVE,
            view_count=0,
            is_video=False,
        )
        assert article.source_id == 1
        assert article.url == "https://example.com"
        assert article.slug == "test-article"
        assert article.title == "Test Article"
        assert article.status == ArticleStatus.ACTIVE
        assert article.view_count == 0
        assert article.is_video is False
