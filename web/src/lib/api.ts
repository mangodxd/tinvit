interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const clientCache = new Map<string, CacheEntry<unknown>>();
const CLIENT_TTL = 120_000;
const MAX_CACHE_SIZE = 100;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

function getRevalidateTime(path: string): number | false {
  if (path.startsWith('/articles/search')) return 0;
  if (path === '/home') return 300;
  if (path.match(/^\/articles\/[^/]+$/)) return 300;
  return 60;
}

function evictLRU(): void {
  if (clientCache.size <= MAX_CACHE_SIZE) return;
  const oldest = clientCache.keys().next().value;
  if (oldest !== undefined) clientCache.delete(oldest);
}

export async function fetchAPI<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = `${path}|${JSON.stringify(options)}`;

  if (typeof window !== 'undefined') {
    const cached = clientCache.get(cacheKey) as CacheEntry<T> | undefined;
    if (cached && cached.expiry > Date.now()) {
      clientCache.delete(cacheKey);
      clientCache.set(cacheKey, cached);
      return cached.data;
    }
  }

  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    next: {
      revalidate: getRevalidateTime(path),
    },
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  const data = await res.json();

  if (typeof window !== 'undefined') {
    evictLRU();
    clientCache.set(cacheKey, { data, expiry: Date.now() + CLIENT_TTL });
  }

  return data;
}

export function clearClientCache(pathPrefix?: string) {
  if (pathPrefix) {
    Array.from(clientCache.keys()).forEach((key) => {
      if (key.startsWith(pathPrefix)) clientCache.delete(key);
    });
  } else {
    clientCache.clear();
  }
}
