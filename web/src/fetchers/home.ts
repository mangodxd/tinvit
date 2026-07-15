import { fetchAPI } from '@/lib/api';
import type { HomepageResponse } from '@/lib/types';

export async function getHomepage(): Promise<HomepageResponse> {
  return fetchAPI<HomepageResponse>('/api/home');
}
