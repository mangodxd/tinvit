import { fetchAPI } from '@/lib/api';
import type { ArticleDetailResponse, ArticleCardData } from '@/lib/types';

export async function getArticle(slug: string): Promise<ArticleDetailResponse> {
  return fetchAPI<ArticleDetailResponse>(`/api/articles/${encodeURIComponent(slug)}`);
}

export async function getRelatedArticles(
  slug: string,
  limit: number = 4
): Promise<ArticleCardData[]> {
  return fetchAPI<ArticleCardData[]>(
    `/api/articles/${encodeURIComponent(slug)}/related?limit=${limit}`
  );
}
