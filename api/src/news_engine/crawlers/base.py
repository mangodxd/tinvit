from __future__ import annotations

import asyncio
import logging
import random
import time
from urllib.parse import urljoin

import httpx
from lxml import html as lxml_html

from src.news_engine.parsers import BaseParser, CrawlResult
from src.news_engine.settings import settings

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "vi-VN,vi;q=0.9",
}

_url_failures: dict[str, tuple[int, float]] = {}
_MAX_FAILURES = 3
_FAILURE_TTL = 600


class _BrowserPool:
    """Manages a reusable Playwright browser instance with context-per-page."""

    def __init__(self):
        self._playwright = None
        self._browser = None

    async def start(self):
        try:
            from playwright.async_api import async_playwright
        except ImportError:
            return
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(headless=True)

    async def render(self, url: str, timeout: int = 20, max_retries: int = 2) -> str | None:
        if not self._browser:
            return None

        for attempt in range(max_retries):
            page = await self._browser.new_page(
                viewport={"width": 1440, "height": 900},
                locale="vi-VN",
            )
            try:
                resp = await page.goto(url, wait_until="domcontentloaded", timeout=timeout * 1000)

                if resp and resp.status == 429:
                    if attempt < max_retries - 1:
                        wait = 3 * (attempt + 1) + random.uniform(0, 1)
                        logging.warning("Playwright 429 for %s, retrying in %.1fs", url, wait)
                        await asyncio.sleep(wait)
                        continue
                    return None

                await page.wait_for_load_state("networkidle", timeout=10000)
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await page.wait_for_timeout(1500)
                await page.evaluate("window.scrollTo(0, 0)")
                await page.wait_for_timeout(500)

                return await page.content()
            except Exception as e:
                logging.warning("Playwright render failed for %s: %s", url, e)
                if attempt < max_retries - 1:
                    await asyncio.sleep(2)
                    continue
                return None
            finally:
                await page.close()

        return None

    async def stop(self):
        if self._browser:
            await self._browser.close()
        if self._playwright:
            await self._playwright.stop()


class BaseSpider:
    source: str = ""
    start_url: str = ""
    use_browser_render: bool = False

    def __init__(self):
        if not self.source:
            raise ValueError("Spider must define `source`")
        self.parser = BaseParser(self.source)
        self.client = httpx.AsyncClient(
            headers=HEADERS, timeout=settings.crawler_timeout, follow_redirects=True
        )
        self._browser_pool = _BrowserPool()
        render_cfg = self.parser.config.get("render", {})
        if render_cfg.get("use_browser", False):
            self.use_browser_render = True

    async def fetch(self, url: str, max_retries: int = 3) -> str:
        last_exc: Exception | None = None
        for attempt in range(max_retries):
            try:
                resp = await self.client.get(url)

                if resp.status_code == 429:
                    retry_after = resp.headers.get("Retry-After")
                    if retry_after and retry_after.isdigit():
                        wait = min(int(retry_after), 30)
                    else:
                        wait = min(2 ** (attempt + 1) + random.uniform(0, 1), 30)
                    logging.warning(
                        "429 rate limit for %s (attempt %d/%d), waiting %.1fs",
                        url, attempt + 1, max_retries, wait,
                    )
                    await asyncio.sleep(wait)
                    continue

                resp.raise_for_status()
                return resp.text

            except httpx.HTTPStatusError as exc:
                if exc.response.status_code == 503 and attempt < max_retries - 1:
                    wait = min(2 ** (attempt + 1) + random.uniform(0, 1), 15)
                    logging.warning("503 for %s, retrying in %.1fs", url, wait)
                    await asyncio.sleep(wait)
                    last_exc = exc
                    continue
                raise

            except httpx.TransportError as exc:
                if attempt < max_retries - 1:
                    wait = min(2 ** (attempt + 1) + random.uniform(0, 1), 15)
                    logging.warning(
                        "Transport error for %s: %s, retrying in %.1fs",
                        url, exc, wait,
                    )
                    await asyncio.sleep(wait)
                    last_exc = exc
                    continue
                raise

        raise last_exc or RuntimeError(f"Failed to fetch {url} after {max_retries} attempts")

    async def fetch_listing(self) -> list[str]:
        listing_url = self.parser.config.get("listing", {}).get("url", self.start_url)
        html = await self.fetch(listing_url)
        tree = lxml_html.fromstring(html)
        xpaths = self.parser.config["listing"]["article_links"]
        urls: list[str] = []
        seen: set[str] = set()
        for xp in xpaths:
            for href in tree.xpath(xp):
                full = urljoin(self.start_url, str(href))
                if full.startswith("http") and full not in seen:
                    urls.append(full)
                    seen.add(full)
        return urls

    def _has_images(self, html: str) -> bool:
        from src.news_engine.parsers.base import _is_placeholder_url
        tree = lxml_html.fromstring(html)
        for img in tree.xpath("//img"):
            for attr in ("src", "data-src"):
                val = (img.get(attr) or "").strip()
                if val and not _is_placeholder_url(val):
                    return True
        return False

    async def crawl(self, limit: int = 20) -> list[CrawlResult]:
        if self.use_browser_render:
            await self._browser_pool.start()

        try:
            urls = await self.fetch_listing()
            if limit:
                urls = urls[:limit]

            results: list[CrawlResult] = []
            for url in urls:
                if url in _url_failures:
                    count, last_fail = _url_failures[url]
                    if count >= _MAX_FAILURES and (time.time() - last_fail) < _FAILURE_TTL:
                        logging.debug("Skipping %s (failed %d times recently)", url, count)
                        continue

                try:
                    html = await self.fetch(url)

                    if self.use_browser_render and not self._has_images(html):
                        logging.debug("No images in httpx response, trying browser render: %s", url)
                        rendered = await self._browser_pool.render(url)
                        if rendered:
                            html = rendered

                    result = self.parser.parse(html, url)
                    results.append(result)
                    _url_failures.pop(url, None)

                except Exception as exc:
                    logging.warning("[crawl] %s — %s", url, exc)
                    count, _ = _url_failures.get(url, (0, 0.0))
                    _url_failures[url] = (count + 1, time.time())
            return results
        finally:
            if self.use_browser_render:
                await self._browser_pool.stop()

    async def aclose(self) -> None:
        await self.client.aclose()
