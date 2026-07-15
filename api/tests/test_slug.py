from src.news_engine.utils.slug import make_slug


class TestMakeSlug:
    def test_basic_english(self):
        assert make_slug("Hello World") == "hello-world"

    def test_vietnamese(self):
        assert make_slug("Thời sự mới nhất") == "thoi-su-moi-nhat"

    def test_special_characters(self):
        assert make_slug("Hello! @World# $Test") == "hello-world-test"

    def test_multiple_hyphens(self):
        assert make_slug("hello---world") == "hello-world"

    def test_max_length(self):
        long_title = "a" * 300
        result = make_slug(long_title, max_len=50)
        assert len(result) <= 50

    def test_empty_string(self):
        assert make_slug("") == ""

    def test_whitespace_only(self):
        assert make_slug("   ") == ""

    def test_preserves_numbers(self):
        assert make_slug("Top 10 News") == "top-10-news"

    def test_unicode_normalization(self):
        result = make_slug("café")
        assert result == "cafe"

    def test_leading_trailing_hyphens(self):
        assert make_slug(" Hello World ") == "hello-world"
