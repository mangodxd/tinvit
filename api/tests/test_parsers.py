from datetime import datetime

from src.news_engine.parsers.base import (
    BaseParser,
    ContentBlock,
    CrawlResult,
    _extract_image_url,
    _is_placeholder_url,
)


class TestIsPlaceholderUrl:
    def test_empty_string(self):
        assert _is_placeholder_url("") is True

    def test_data_image_gif(self):
        assert _is_placeholder_url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") is True

    def test_data_image_svg(self):
        assert _is_placeholder_url("data:image/svg+xml,<svg></svg>") is True

    def test_real_url(self):
        assert _is_placeholder_url("https://example.com/image.jpg") is False

    def test_whitespace(self):
        assert _is_placeholder_url("  ") is False


class TestExtractImageUrl:
    def test_src_attribute(self):
        class MockElement:
            def get(self, attr):
                if attr == "src":
                    return "https://example.com/image.jpg"
                return None
        assert _extract_image_url(MockElement()) == "https://example.com/image.jpg"

    def test_data_src_fallback(self):
        class MockElement:
            def get(self, attr):
                if attr == "src":
                    return ""
                if attr == "data-src":
                    return "https://example.com/lazy.jpg"
                return None
        assert _extract_image_url(MockElement()) == "https://example.com/lazy.jpg"

    def test_skips_placeholder(self):
        class MockElement:
            def get(self, attr):
                if attr == "src":
                    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                if attr == "data-src":
                    return "https://example.com/real.jpg"
                return None
        assert _extract_image_url(MockElement()) == "https://example.com/real.jpg"


class TestContentBlock:
    def test_default_values(self):
        block = ContentBlock(type="text")
        assert block.type == "text"
        assert block.content == ""
        assert block.src == ""
        assert block.caption == ""

    def test_with_values(self):
        block = ContentBlock(
            type="image",
            src="https://example.com/img.jpg",
            caption="Test image",
        )
        assert block.type == "image"
        assert block.src == "https://example.com/img.jpg"
        assert block.caption == "Test image"


class TestCrawlResult:
    def test_default_values(self):
        result = CrawlResult(url="https://example.com", source="test", title="Test")
        assert result.url == "https://example.com"
        assert result.source == "test"
        assert result.title == "Test"
        assert result.content == []
        assert result.tags == []

    def test_with_content(self):
        content = [ContentBlock(type="text", content="Hello")]
        result = CrawlResult(
            url="https://example.com",
            source="test",
            title="Test",
            content=content,
        )
        assert len(result.content) == 1
        assert result.content[0].content == "Hello"


class TestBaseParser:
    def test_load_config(self):
        parser = BaseParser("vnexpress")
        assert parser.site_name == "vnexpress"
        assert "article" in parser.config
        assert "listing" in parser.config

    def test_invalid_site_raises(self):
        try:
            BaseParser("nonexistent_site")
            assert False, "Should have raised FileNotFoundError"
        except FileNotFoundError:
            assert True

    def test_parse_date_formats(self):
        parser = BaseParser("vnexpress")
        # ISO format
        assert parser._parse_date("2024-01-15T10:30:00+07:00") is not None
        # Vietnamese format
        assert parser._parse_date("15/01/2024 10:30") is not None
        # Empty string
        assert parser._parse_date("") is None
        # Invalid date
        assert parser._parse_date("not a date") is None
