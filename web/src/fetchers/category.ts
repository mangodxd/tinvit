import { fetchAPI } from '@/lib/api';
import type { CategoryArticlesResponse } from '@/lib/types';

export async function getCategoryArticles(
  slug: string,
  page: number = 1
): Promise<CategoryArticlesResponse> {
  return fetchAPI<CategoryArticlesResponse>(
    `/api/articles?category=${encodeURIComponent(slug)}&page=${page}`
  );
}
