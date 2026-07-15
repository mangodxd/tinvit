import { fetchAPI } from '@/lib/api';
import type { SearchResponse } from '@/lib/types';

export async function searchArticles(
  query: string,
  page: number = 1
): Promise<SearchResponse> {
  return fetchAPI<SearchResponse>(
    `/api/articles/search?q=${encodeURIComponent(query)}&page=${page}`
  );
}
