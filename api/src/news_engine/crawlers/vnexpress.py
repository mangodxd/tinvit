from src.news_engine.crawlers.base import BaseSpider


class VNExpressSpider(BaseSpider):
    source = "vnexpress"
    start_url = "https://vnexpress.net"
