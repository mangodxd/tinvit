from src.news_engine.crawlers.base import BaseSpider


class TuoiTreSpider(BaseSpider):
    source = "tuoitre"
    start_url = "https://tuoitre.vn"
