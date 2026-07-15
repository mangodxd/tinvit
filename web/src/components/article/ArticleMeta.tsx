import { formatRelativeTime } from '@/lib/utils';

interface ArticleMetaProps {
  source: string;
  publishedAt: string;
  views?: number;
}

export function ArticleMeta({ source, publishedAt, views }: ArticleMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-caption text-meta font-body">
      <span className="font-medium text-dark">{source}</span>
      <span>{formatRelativeTime(publishedAt)}</span>
      {views !== undefined && (
        <span>{views.toLocaleString('vi-VN')} lượt xem</span>
      )}
    </div>
  );
}
