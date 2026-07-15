# Tin Vịt — Web

Next.js 14 news reader frontend. Consumes the TinVit API.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Env

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | API server URL |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public site URL |
| `WEBHOOK_SECRET` | — | Secret for revalidation webhook |

## Pages

| Route | Content |
|-------|---------|
| `/` | Homepage — hero, featured, categories |
| `/article/[slug]` | Article detail |
| `/category/[slug]` | Category listing |
| `/search?q=` | Search results |
| `/contact` | Contact form |

## Stack

Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide icons.
