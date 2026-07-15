import Link from 'next/link';
import { cn } from '@/lib/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
}

function buildUrl(baseUrl: string, page: number, queryParams?: Record<string, string>): string {
  const params = new URLSearchParams(queryParams || {});
  if (page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${baseUrl}?${qs}` : baseUrl;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  queryParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function getPageNumbers(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (currentPage > 3) pages.push('ellipsis');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis');
    pages.push(totalPages);
    return pages;
  }

  const pageNumbers = getPageNumbers();

  return (
    <nav aria-label="Phân trang" className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 && (
        <Link
          href={buildUrl(baseUrl, currentPage - 1, queryParams)}
          className="px-3 py-2 text-caption text-meta hover:text-primary hover:bg-accent transition-colors"
          aria-label="Trang trước"
        >
          « Trước
        </Link>
      )}

      {pageNumbers.map((page, idx) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-3 py-2 text-meta">
            ...
          </span>
        ) : (
          <Link
            key={page}
            href={buildUrl(baseUrl, page, queryParams)}
            className={cn(
              'px-3 py-2 text-caption transition-colors',
              page === currentPage
                ? 'bg-primary text-white font-medium'
                : 'text-meta hover:text-primary hover:bg-accent'
            )}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Trang ${page}`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(baseUrl, currentPage + 1, queryParams)}
          className="px-3 py-2 text-caption text-meta hover:text-primary hover:bg-accent transition-colors"
          aria-label="Trang sau"
        >
          Sau »
        </Link>
      )}
    </nav>
  );
}
