# TinVit API

News aggregation engine — crawl, store, and serve Vietnamese articles via REST API.

## Quick start

```bash
cp .env.example .env
docker compose up -d
```

API at `http://localhost:8000/api`.

## Without Docker

```bash
pip install .
cp .env.example .env
# edit DATABASE_URL in .env

createdb newsdb
python main.py
```

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/home` | Homepage — latest + categories |
| `GET` | `/api/articles?source=&category=&page=&limit=` | List articles |
| `GET` | `/api/articles/search?q=` | Search by title |
| `GET` | `/api/articles/{slug}` | Article detail |
| `GET` | `/api/sources` | List news sources |
| `GET` | `/api/categories` | List categories |
| `POST` | `/api/crawl?source=&limit=` | Trigger crawl |
| `GET` | `/api/health` | Health check |

## Adding a new source

1. Create `src/news_engine/config/sites/{name}.yaml` with XPath selectors.
2. Create a spider class (4 lines) in `crawlers/`.
3. Register in `crawlers/__init__.py`.

## Structure

```
src/news_engine/
├── api/            # FastAPI routers
├── config/sites/   # YAML site configs
├── crawlers/       # Spiders (4 lines each)
├── models/         # SQLAlchemy models
├── parsers/        # YAML-driven parser
├── repositories/   # DB access layer
├── services/       # Business logic
├── utils/          # Slug, date helpers
├── database.py     # Engine + session
└── settings.py     # Pydantic settings
```

## Tech

Python 3.11+, FastAPI, SQLAlchemy (async), PostgreSQL 16, httpx, lxml, APScheduler.

## License

MIT
