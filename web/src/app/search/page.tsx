import { Suspense } from 'react';
import type { Metadata } from 'next';
import { searchArticles } from '@/fetchers/search';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SearchBar } from '@/components/layout/SearchBar';
import { ArticleList } from '@/components/article/ArticleList';
import { Pagination, Skeleton, EmptyState } from '@/components/ui';
import { Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tìm kiếm',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: { q?: string; page?: string };
}

async function SearchContent({ query, page }: { query: string; page: number }) {
  if (!query.trim()) {
    return (
      <section className="bg-page py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Search className="w-12 h-12 mx-auto text-meta/40 mb-3" />
              <h1 className="text-heading font-bold text-dark font-heading">Tìm kiếm bài viết</h1>
              <p className="text-caption text-meta mt-2">
                Nhập từ khóa để tìm kiếm tin tức trên Tin Vịt
              </p>
            </div>
            <SearchBar variant="page" />
          </div>
        </div>
      </section>
    );
  }

  let data;
  try {
    data = await searchArticles(query, page);
  } catch {
    return (
      <section className="bg-page py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <SearchBar variant="page" />
            <EmptyState
              title="Không thể tìm kiếm"
              description="Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau."
              action={{ label: 'Về trang chủ', href: '/' }}
            />
          </div>
        </div>
      </section>
    );
  }

  const hasResults = data.results && data.results.length > 0;

  return (
    <>
      <section className="bg-accent py-3">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Tìm kiếm' },
              ...(query.trim() ? [{ label: `"${query.trim()}"` }] : []),
            ]}
          />
        </div>
      </section>

      <section className="bg-page py-6 lg:py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <SearchBar variant="page" />

            {hasResults && (
              <p className="text-caption text-meta mt-4 mb-6">
                {data.total} kết quả cho &ldquo;{query.trim()}&rdquo;
              </p>
            )}

            {hasResults ? (
              <ArticleList articles={data.results} />
            ) : (
              <EmptyState
                title="Không tìm thấy kết quả"
                description={`Không tìm thấy bài viết nào phù hợp với "${query.trim()}".`}
                action={{ label: 'Thử tìm kiếm khác', href: '/search' }}
              />
            )}

            {hasResults && (
              <div className="mt-8">
                <Pagination
                  currentPage={data.page}
                  totalPages={data.total_pages}
                  baseUrl="/search"
                  queryParams={{ q: query.trim() }}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function SearchSkeleton() {
  return (
    <div className="bg-page py-8">
      <div className="container">
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton variant="text" />
          <Skeleton variant="list" />
          <Skeleton variant="list" />
          <Skeleton variant="list" />
        </div>
      </div>
    </div>
  );
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || '';
  const page = parseInt(searchParams.page || '1', 10) || 1;

  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent query={query} page={page} />
    </Suspense>
  );
}
