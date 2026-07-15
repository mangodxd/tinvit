from __future__ import annotations

import re
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import yaml
from lxml import html as lxml_html
from pydantic import BaseModel


class ContentBlock(BaseModel):
    type: str  # "text", "image", "video", "quote"
    content: str = ""
    src: str = ""
    caption: str = ""


# Prefixes that indicate a lazy-load placeholder, not a real image
_PLACEHOLDER_PREFIXES = (
    "data:image/gif",
    "data:image/svg",
    "data:image/png;base64,iVBOR",  # 1x1 transparent PNG
)


def _is_placeholder_url(url: str) -> bool:
    """Check if a URL is a lazy-load placeholder (data: URI)."""
    if not url:
        return True
    stripped = url.strip().lower()
    return any(stripped.startswith(p) for p in _PLACEHOLDER_PREFIXES)


def _extract_image_url(img_elem) -> str:
    """Extract the best image URL from an <img> element.

    Tries multiple attributes in priority order:
    src -> data-src -> data-lazy-src -> data-original -> srcset (first entry)
    Skips data: placeholder URLs.
    """
    for attr in ("src", "data-src", "data-lazy-src", "data-original"):
        val = (img_elem.get(attr) or "").strip()
        if val and not _is_placeholder_url(val):
            return val

    # Fallback: try srcset (take the first URL)
    srcset = (img_elem.get("srcset") or "").strip()
    if srcset:
        first_entry = srcset.split(",")[0].strip()
        url = first_entry.split()[0] if first_entry else ""
        if url and not _is_placeholder_url(url):
            return url

    return ""


class CrawlResult(BaseModel):
    url: str
    source: str
    title: str
    description: str = ""
    content: list[ContentBlock] = []
    published_at: Optional[datetime] = None
    category: Optional[str] = ""
    tags: list[str] = []
    author: str = ""
    image_urls: list[str] = []


class BaseParser:
    SITES_DIR = Path(__file__).parent.parent / "config" / "sites"

    def __init__(self, site_name: str):
        self.site_name = site_name
        self.config = self._load_config(site_name)

    def _load_config(self, site_name: str) -> dict[str, Any]:
        path = self.SITES_DIR / f"{site_name}.yaml"
        if not path.exists():
            msg = f"Config not found for site: {site_name}"
            raise FileNotFoundError(msg)
        with open(path, encoding="utf-8") as f:
            return yaml.safe_load(f)

    def _parse_date(self, date_str: str, fmt: str = "") -> Optional[datetime]:
        if not date_str:
            return None

        date_str = date_str.strip()
        date_str = re.sub(r"\(GMT.*?\)", "", date_str).strip()
        date_str = re.sub(r"Thứ [\w]+,\s*", "", date_str).strip()
        date_str = date_str.replace(",", "")

        formats_to_try = [
            fmt,
            "%Y-%m-%dT%H:%M:%S%z",
            "%d/%m/%Y %H:%M",
            "%d/%m/%Y, %H:%M",
            "%H:%M %d/%m/%Y",
            "%Y/%m/%d %H:%M",
            "%d/%m/%Y",
            "%Y-%m-%d",
        ]
        for f in formats_to_try:
            if not f:
                continue
            try:
                return datetime.strptime(date_str, f)
            except (ValueError, TypeError):
                continue
        return None

    def _extract_first(self, tree: lxml_html.HtmlElement, xpaths: list[str]) -> str:
        for xpath in xpaths:
            results = tree.xpath(xpath)
            for r in results:
                if isinstance(r, str) and r.strip():
                    return r.strip()
                if hasattr(r, "text_content") and r.text_content().strip():
                    return r.text_content().strip()
                if hasattr(r, "text") and r.text and r.text.strip():
                    return r.text.strip()
        return ""

    def _extract_all(self, tree: lxml_html.HtmlElement, xpaths: list[str]) -> list[str]:
        results: list[str] = []
        seen: set[str] = set()
        for xpath in xpaths:
            for elem in tree.xpath(xpath):
                if isinstance(elem, str):
                    text = elem.strip()
                elif hasattr(elem, "text_content"):
                    text = elem.text_content().strip()
                elif hasattr(elem, "text") and elem.text:
                    text = elem.text.strip()
                else:
                    continue
                if not text:
                    continue
                # Handle comma-separated values (e.g. meta article:tag)
                if "," in text:
                    for part in text.split(","):
                        part = part.strip()
                        if part and part.lower() not in seen:
                            results.append(part)
                            seen.add(part.lower())
                elif text not in seen:
                    results.append(text)
                    seen.add(text)
        return results

    def _parse_content_blocks(
        self, tree: lxml_html.HtmlElement, xpaths: list[str]
    ) -> list[ContentBlock]:
        blocks: list[ContentBlock] = []
        raw_elems: list[Any] = []

        for xpath in xpaths:
            raw_elems.extend(tree.xpath(xpath))

        for elem in raw_elems:
            tag = elem.tag if hasattr(elem, "tag") else ""
            tag = (tag or "").lower()

            if tag == "figure":
                imgs = elem.xpath(".//img")
                img = imgs[0] if imgs else None
                src = _extract_image_url(img) if img is not None else ""
                caption_el = elem.xpath(
                    ".//figcaption//text() | .//p[contains(@class,'caption')]//text()"
                )
                caption = " ".join(c.strip() for c in caption_el if c.strip())
                if src:
                    blocks.append(ContentBlock(type="image", src=src, caption=caption))
            elif tag == "img":
                src = _extract_image_url(elem)
                if src:
                    blocks.append(ContentBlock(type="image", src=src))
            elif tag == "video":
                src = (elem.get("src") or "").strip()
                if not src:
                    source = elem.xpath(".//source[@src]")
                    src = (source[0].get("src") or "").strip() if source else ""
                if src:
                    blocks.append(ContentBlock(type="video", src=src))
            elif tag in ("div",) and elem.get("type", "").lower() == "videostream":
                iframe = elem.xpath(".//iframe")
                src = iframe[0].get("src", "") if iframe else ""
                blocks.append(ContentBlock(type="video", src=src))
            elif tag in ("div",) and "brief_info" in (elem.get("class", "") or ""):
                text = elem.text_content().strip()
                blocks.append(ContentBlock(type="quote", content=text))
            else:
                text = elem.text_content().strip()
                if text:
                    blocks.append(ContentBlock(type="text", content=text))

        return blocks

    def _extract_category_from_url(self, url: str, cfg: dict) -> str | None:
        from urllib.parse import urlparse
        path = urlparse(url).path.strip("/")
        parts = path.split("/")
        if not parts:
            return None
        path_map = cfg.get("category_path_map", {})
        if len(parts) >= 2:
            slug = parts[0] if parts[0] != "category" else parts[1]
            if slug in path_map:
                return path_map[slug]
        first = parts[0]
        if first in path_map:
            return path_map[first]
        return None

    def parse(self, html: str, url: str) -> CrawlResult:
        tree = lxml_html.fromstring(html)
        cfg = self.config["article"]

        title = self._extract_first(tree, cfg.get("title", []))
        description = self._extract_first(tree, cfg.get("description", []))
        date_str = self._extract_first(tree, cfg.get("date", []))
        date_fmt = cfg.get("date_format", "")
        published_at = self._parse_date(date_str, date_fmt)
        category = self._extract_first(tree, cfg.get("category", []))
        if not category and cfg.get("category_from_path"):
            category = self._extract_category_from_url(url, cfg)
        tags = self._extract_all(tree, cfg.get("tags", []))
        author = self._extract_first(tree, cfg.get("author", []))
        content = self._parse_content_blocks(tree, cfg.get("content", []))
        image_urls = [b.src for b in content if b.type == "image"]

        return CrawlResult(
            url=url,
            source=self.site_name,
            title=title or url,
            description=description,
            content=content,
            published_at=published_at,
            category=category,
            tags=tags,
            author=author,
            image_urls=image_urls,
        )
