import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCategoryArticles } from '@/fetchers/category';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { SectionHeader, Pagination, Skeleton, EmptyState } from '@/components/ui';
import { ArticleList } from '@/components/article/ArticleList';
import { getCategoryName, getCategoryColor } from '@/lib/constants';

interface Props {
  params: { slug: string };
  searchParams: { page?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: getCategoryName(params.slug),
    description: `Bài viết chuyên mục ${getCategoryName(params.slug)}`,
  };
}

async function CategoryContent({ slug, page }: { slug: string; page: number }) {
  let data;
  try {
    data = await getCategoryArticles(slug, page);
  } catch {
    notFound();
  }

  const categoryName = data.category?.name || getCategoryName(slug);
  const categoryColor = data.category?.color || getCategoryColor(slug);
  const totalArticles = data.total || 0;

  return (
    <>
      <section className="bg-accent py-3">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: categoryName },
            ]}
          />
        </div>
      </section>

      <section className="bg-page py-6 lg:py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <SectionHeader title={categoryName} color={categoryColor} />

            {totalArticles > 0 && (
              <p className="text-caption text-meta mb-4">
                {totalArticles} bài viết{page > 1 && ` — Trang ${page}`}
              </p>
            )}

            {data.articles && data.articles.length > 0 ? (
              <ArticleList
                articles={data.articles}
                emptyMessage={`Chưa có bài viết nào trong chuyên mục ${categoryName}.`}
              />
            ) : (
              <EmptyState
                title="Chưa có bài viết"
                description={`Chưa có bài viết nào trong chuyên mục ${categoryName}.`}
              />
            )}

            {data.articles && data.articles.length > 0 && (
              <div className="mt-8">
                <Pagination
                  currentPage={data.page}
                  totalPages={data.total_pages}
                  baseUrl={`/category/${slug}`}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function CategorySkeleton() {
  return (
    <div className="bg-page py-8">
      <div className="container">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton variant="list" />
          <Skeleton variant="list" />
          <Skeleton variant="list" />
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page || '1', 10) || 1;

  return (
    <Suspense fallback={<CategorySkeleton />}>
      <CategoryContent slug={params.slug} page={page} />
    </Suspense>
  );
}
