'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { ArticleImage } from '@/components/ui/ArticleImage';
import Link from 'next/link';
import type { ArticleCardData } from '@/lib/types';

interface SearchBarProps {
  placeholder?: string;
  variant?: 'header' | 'page';
}

export function SearchBar({
  placeholder = 'Tìm kiếm...',
  variant = 'header',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ArticleCardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.items || []);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      setIsOpen(false);
      setQuery('');
    },
    [query, router]
  );

  const handleResultClick = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !isOpen && variant === 'header') {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return;
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setQuery('');
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, variant]);

  if (variant === 'page') {
    return (
      <form onSubmit={handleSubmit} role="search" className="w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-meta w-5 h-5" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 text-body placeholder:text-meta focus:outline-none focus:border-primary transition-colors font-body"
            aria-label="Tìm kiếm bài viết"
          />
        </div>
      </form>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-dark hover:text-primary transition-colors duration-200 cursor-pointer"
        aria-label="Mở tìm kiếm"
      >
        <Search className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <form onSubmit={handleSubmit} role="search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-meta w-4 h-4" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 text-body placeholder:text-meta focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all bg-surface font-body shadow-lg rounded-lg"
                aria-label="Tìm kiếm bài viết"
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-meta animate-spin" />
              )}
            </div>
          </form>

          {results.length > 0 && (
            <div className="mt-1 bg-surface border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <ul className="divide-y divide-gray-100">
                {results.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/article/${article.slug}`}
                      onClick={handleResultClick}
                      className="flex gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      {article.image_url ? (
                        <div className="w-12 h-12 shrink-0 rounded overflow-hidden bg-accent relative">
                          <ArticleImage
                            src={article.image_url}
                            alt=""
                            fill
                            aspectRatio="auto"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-caption font-medium text-dark line-clamp-2 font-heading">
                          {article.title}
                        </p>
                        <p className="text-small text-meta mt-0.5">
                          {article.category_name}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={handleResultClick}
                className="block text-center py-2.5 text-small text-primary hover:bg-gray-50 transition-colors border-t border-gray-100 cursor-pointer"
              >
                Xem tất cả kết quả →
              </Link>
            </div>
          )}

          {debouncedQuery && debouncedQuery.length >= 2 && !isLoading && results.length === 0 && (
            <div className="mt-1 bg-surface border border-gray-200 rounded-lg shadow-lg p-4 text-center">
              <p className="text-caption text-meta">Không tìm thấy kết quả</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
