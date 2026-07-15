from src.news_engine.crawlers.base import BaseSpider
from src.news_engine.crawlers.dantri import DanTriSpider
from src.news_engine.crawlers.tuoitre import TuoiTreSpider
from src.news_engine.crawlers.vnexpress import VNExpressSpider

SPIDERS: dict[str, type[BaseSpider]] = {
    "vnexpress": VNExpressSpider,
    "tuoitre": TuoiTreSpider,
    "dantri": DanTriSpider,
}

__all__ = ["BaseSpider", "SPIDERS"]
