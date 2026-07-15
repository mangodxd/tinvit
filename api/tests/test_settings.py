import os
from unittest.mock import patch

from src.news_engine.settings import Settings


class TestSettings:
    def test_default_values(self):
        settings = Settings()
        assert settings.api_host == "0.0.0.0"
        assert settings.api_port == 8000
        assert settings.crawler_timeout == 30
        assert settings.log_level == "INFO"

    def test_database_url_default(self):
        settings = Settings()
        assert "postgresql+asyncpg://" in settings.database_url

    def test_cors_origins_default(self):
        settings = Settings()
        assert isinstance(settings.cors_origins, list)

    def test_settings_from_env(self):
        with patch.dict(os.environ, {"API_PORT": "9000"}):
            settings = Settings()
            assert settings.api_port == 9000

    def test_settings_from_env_host(self):
        with patch.dict(os.environ, {"API_HOST": "127.0.0.1"}):
            settings = Settings()
            assert settings.api_host == "127.0.0.1"
