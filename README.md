# TinVit

Vietnamese news aggregation platform. Crawls, stores, and serves articles from Vietnamese news sources.

## Live Demo

- Frontend: [https://tinvit-web.vercel.app](https://tinvit-web.vercel.app)
- API: [https://tinvit-api.onrender.com](https://tinvit-api.onrender.com)

## Structure

```
tinvit/
├── api/         # FastAPI + PostgreSQL — news aggregation engine
├── web/         # Next.js 14 — frontend application
└── docs/        # shared documentation
```

## Quick start (Local Development)

```bash
# API (requires Docker)
cd api
cp .env.example .env
docker compose up -d

# Web (requires Node.js 18+)
cd web
npm install
npm run dev
```

- API: http://localhost:8000
- Web: http://localhost:3000
- API Docs: http://localhost:8000/docs

## Deployment

### Backend (Render)

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Blueprint
3. Connect your GitHub repo
4. Render will detect `render.yaml` and set up:
   - Web service for the API
   - PostgreSQL database
5. Set environment variable `CORS_ORIGINS` to your Vercel URL:
   ```json
   ["https://your-app.vercel.app"]
   ```
6. Deploy!

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → Import Project
2. Connect your GitHub repo
3. Set environment variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your Render API URL (e.g., `https://tinvit-api.onrender.com`)
   - `NEXT_PUBLIC_SITE_URL`: Your Vercel URL (e.g., `https://your-app.vercel.app`)
4. Deploy!

## Tech

| Layer | Stack |
|-------|-------|
| API | Python 3.11+, FastAPI, SQLAlchemy (async), PostgreSQL 16 |
| Web | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Crawler | httpx, lxml, APScheduler |
| Deployment | Render (API) + Vercel (Web) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/home` | Homepage data |
| GET | `/api/articles` | List articles (paginated) |
| GET | `/api/articles/search?q=...` | Search articles |
| GET | `/api/articles/{slug}` | Get article detail |
| GET | `/api/articles/{slug}/related` | Get related articles |
| GET | `/api/categories` | List categories |
| GET | `/api/sources` | List sources |
| POST | `/api/crawl` | Trigger crawl (admin) |

## License

MIT
