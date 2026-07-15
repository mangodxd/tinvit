import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/constants';

const STATIC_ROUTES = [
  { url: '/', changeFrequency: 'hourly' as const, priority: 1.0 },
  { url: '/contact', changeFrequency: 'monthly' as const, priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let articleEntries: MetadataRoute.Sitemap = [];
  let categoryEntries: MetadataRoute.Sitemap = [];

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

    const [articlesRes, categoriesRes] = await Promise.allSettled([
      fetch(`${apiBase}/api/articles?limit=50`),
      fetch(`${apiBase}/api/categories`),
    ]);

    if (articlesRes.status === 'fulfilled' && articlesRes.value.ok) {
      const data = await articlesRes.value.json();
      const articles = data.items || data.articles || [];
      articleEntries = articles.map((article: { slug: string; updated_at?: string }) => ({
        url: `${siteUrl}/article/${article.slug}`,
        lastModified: article.updated_at || new Date().toISOString(),
        changeFrequency: 'hourly' as const,
        priority: 0.8,
      }));
    }

    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
      const categories = await categoriesRes.value.json();
      categoryEntries = categories.map((cat: { slug: string }) => ({
        url: `${siteUrl}/category/${cat.slug}`,
        changeFrequency: 'hourly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // fallback: just static routes
  }

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${siteUrl}${route.url}`,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...articleEntries,
    ...categoryEntries,
  ];
}
