'use client';

import Link from 'next/link';
import { ArticleImage } from '@/components/ui/ArticleImage';
import { formatRelativeTime } from '@/lib/utils';
import { getCategoryColor } from '@/lib/constants';
import type { ArticleCardData, Category } from '@/lib/types';

interface SidebarProps {
  recentArticles?: ArticleCardData[];
  categories?: { slug: string; name: string; count?: number }[];
  tags?: { name: string; slug: string }[];
}

function RecentPosts({ articles }: { articles: ArticleCardData[] }) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-4">
      {articles.slice(0, 6).map((article) => (
        <li key={article.slug}>
          <Link
            href={`/article/${article.slug}`}
            className="flex gap-3 group cursor-pointer"
          >
            <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-accent group-hover:ring-2 ring-primary/20 transition-all duration-200">
              {article.image_url ? (
                <ArticleImage
                  src={article.image_url}
                  alt={article.title}
                  fill
                  wrapperClassName="w-full h-full"
                  aspectRatio="auto"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-accent to-gray-200" />
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <h4 className="text-caption font-medium text-dark group-hover:text-primary transition-colors duration-200 line-clamp-2 font-body">
                {article.title}
              </h4>
              <span className="text-small text-meta">
                {article.source_name}
              </span>
              <span className="text-small text-meta mt-auto block">
                {formatRelativeTime(article.published_at)}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function CategoryList({ categories }: { categories: { slug: string; name: string; count?: number }[] }) {
  if (!categories || categories.length === 0) return null;

  const displayCategories = categories.slice(0, 7);
  const hasMore = categories.length > 7;

  return (
    <>
      <ul className="space-y-1">
        {displayCategories.map((cat) => {
          const color = getCategoryColor(cat.slug);
          return (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                className="flex items-center justify-between text-caption text-body hover:text-primary transition-colors duration-200 py-1.5 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />
                  {cat.name}
                </span>
                {cat.count !== undefined && (
                  <span className="text-small text-meta">({cat.count})</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      {hasMore && (
        <Link
          href="/category"
          className="inline-block mt-2 text-small text-primary hover:text-primary/80 transition-colors cursor-pointer"
        >
          Xem thêm →
        </Link>
      )}
    </>
  );
}

function TagCloud({ tags }: { tags: { name: string; slug: string }[] }) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.slice(0, 12).map((tag) => (
        <Link
          key={tag.slug}
          href={`/search?q=${encodeURIComponent(tag.name)}`}
          className="inline-block px-3 py-1.5 text-small text-meta bg-gray-100 hover:bg-gray-200 hover:text-dark rounded-full transition-colors cursor-pointer"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}

export function Sidebar({
  recentArticles,
  categories,
  tags,
}: SidebarProps) {
  const hasArticles = recentArticles && recentArticles.length > 0;

  return (
    <aside className="space-y-8">
      {hasArticles && (
        <div>
          <h3 className="font-heading font-bold text-subheading text-dark mb-4">
            Bài viết mới nhất
          </h3>
          <RecentPosts articles={recentArticles} />
          <Link
            href="/category"
            className="mt-4 block text-center px-4 py-2.5 text-caption font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
          >
            Xem thêm
          </Link>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-subheading text-dark mb-4">
            Chuyên mục
          </h3>
          <CategoryList categories={categories} />
        </div>
      )}

      {tags && tags.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-subheading text-dark mb-4">
            Thẻ tags
          </h3>
          <TagCloud tags={tags} />
        </div>
      )}
    </aside>
  );
}
