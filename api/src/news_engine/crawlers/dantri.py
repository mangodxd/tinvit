from src.news_engine.crawlers.base import BaseSpider


class DanTriSpider(BaseSpider):
    source = "dantri"
    start_url = "https://dantri.com.vn"
