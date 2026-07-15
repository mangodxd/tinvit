import { ArticleCard } from '@/components/article/ArticleCard';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ArticleCardData } from '@/lib/types';

interface ArticleListProps {
  articles: ArticleCardData[];
  variant?: 'horizontal' | 'compact';
  emptyMessage?: string;
  showExcerpt?: boolean;
}

export function ArticleList({
  articles,
  variant = 'horizontal',
  emptyMessage = 'Không có bài viết nào',
  showExcerpt = true,
}: ArticleListProps) {
  if (!articles || articles.length === 0) {
    return <EmptyState description={emptyMessage} />;
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.slug}
          article={article}
          variant="horizontal"
        />
      ))}
    </div>
  );
}
