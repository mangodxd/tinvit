# Tin Vịt 🦆

> Vietnamese news aggregation platform — crawls, stores, and serves news from multiple sources.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Topics:** `nextjs` `fastapi` `python` `postgresql` `web-scraping` `news-aggregator` `vietnamese` `docker` `tailwindcss` `sqlalchemy`

## Demo

- **Web:** https://tinvit.vercel.app
- **API:** https://tinvit-api.containers.snapdeploy.app/docs

## About

This is a side project I built to learn about web scraping and full-stack development. It crawls news from VNExpress, Tuổi Trẻ, and Dân Trí, stores them in PostgreSQL, and serves through a FastAPI backend with a Next.js frontend.

**What it does:**
- Crawls articles every 5 minutes from 3 Vietnamese news sources
- Categorizes into 20+ topics (Thời sự, Kinh doanh, Công nghệ, etc.)
- Full-text search using PostgreSQL trigram
- Detects video articles
- SEO-friendly with sitemap, OpenGraph, JSON-LD

## Project Structure

```
tinvit/
├── api/                        # Python backend
│   ├── src/news_engine/
│   │   ├── api/                # FastAPI routes
│   │   ├── crawlers/           # News spiders
│   │   ├── models/             # SQLAlchemy models
│   │   ├── repositories/       # Database queries
│   │   ├── services/           # Business logic
│   │   ├── parsers/            # HTML → structured data
│   │   └── config/sites/       # Crawl configs (YAML)
│   ├── tests/                  # Unit tests
│   ├── Dockerfile              # Docker config for SnapDeploy
│   └── pyproject.toml
├── web/                        # Next.js frontend
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   ├── components/         # React components
│   │   ├── fetchers/           # API calls
│   │   └── lib/                # Utils, types, constants
│   └── package.json
└── README.md
```

## Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (for PostgreSQL)

### Setup

```bash
# clone
git clone https://github.com/mangodxd/tinvit.git
cd tinvit
```

**Database:**

```bash
cd api
docker compose up -d
```

This starts PostgreSQL on port 5432. The database is `newsdb`, user `postgres`, password `123456`.

**API:**

```bash
# install deps
pip install -e .

# copy env file (edit if needed)
cp .env.example .env

# run
uvicorn src.news_engine.api.main:app --reload
```

API runs on http://localhost:8000. Docs at http://localhost:8000/docs

**Web:**

```bash
cd ../web
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### Environment Variables

**api/.env:**

```env
# for local dev (docker)
DATABASE_URL=postgresql+asyncpg://postgres:123456@localhost:5432/newsdb

# for production (SnapDeploy sets this automatically)
# DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=["http://localhost:3000"]  # add your vercel url for prod
CRAWLER_TIMEOUT=30
LOG_LEVEL=INFO
```

**web/.env.local:**

```env
# for local dev
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# for production
# NEXT_PUBLIC_API_BASE_URL=https://your-api.snapdeploy.app
# NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

### Running Tests

```bash
cd api
pytest tests/ -v
```

## Deploy

### Frontend

```bash
cd web
vercel --prod
```

Or connect your GitHub repo on Vercel, Netlify, or any static host.

**Env vars:**

| Variable | Local | Production |
|----------|-------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | `https://your-api-domain.com` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |

### Backend

Any Docker-compatible host (Render, Railway, Fly.io, SnapDeploy, etc.).

```bash
cd api
docker build -t tinvit-api .
docker run -p 8000:8000 --env-file .env tinvit-api
```

**Env vars:**

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql+asyncpg://user:pass@host:5432/dbname` |
| `CORS_ORIGINS` | `["https://your-app.vercel.app"]` |
| `API_HOST` | `0.0.0.0` |
| `API_PORT` | `8000` |
| `CRAWLER_TIMEOUT` | `30` |
| `LOG_LEVEL` | `INFO` |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/home` | Homepage data |
| GET | `/api/articles` | List articles (supports `?page=`, `?limit=`, `?source=`, `?category=`) |
| GET | `/api/articles/search?q=...` | Search |
| GET | `/api/articles/{slug}` | Article detail |
| GET | `/api/articles/{slug}/related` | Related articles |
| GET | `/api/categories` | All categories |
| GET | `/api/sources` | All sources |
| POST | `/api/crawl` | Trigger crawl manually |

## Adding a New Source

1. Add YAML config in `api/src/news_engine/config/sites/yoursource.yaml`:

```yaml
site: yoursource
name: Your Source
base_url: https://example.com

listing:
  url: https://example.com
  article_links:
    - //a[@class="article-link"]/@href

article:
  title:
    - //h1/text()
  description:
    - //meta[@name="description"]/@content
  content:
    - //article/body//p
  date:
    - //time/@datetime
  category:
    - //span[@class="category"]/text()
  tags:
    - //meta[@property="article:tag"]/@content
```

2. Create spider in `api/src/news_engine/crawlers/yoursource.py`:

```python
from src.news_engine.crawlers.base import BaseSpider

class YourSourceSpider(BaseSpider):
    source = "yoursource"
    start_url = "https://example.com"
```

3. Register in `api/src/news_engine/crawlers/__init__.py`:

```python
from src.news_engine.crawlers.yoursource import YourSourceSpider

SPIDERS = {
    # ...existing spiders
    "yoursource": YourSourceSpider,
}
```

## Tech

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Python 3.11, FastAPI, SQLAlchemy (async), Pydantic
- **Database:** PostgreSQL 16 (with pg_trgm for Vietnamese search)
- **Crawler:** httpx, lxml, APScheduler

## License

MIT
