import { ArticleCard } from '@/components/article/ArticleCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import type { ArticleCardData } from '@/lib/types';

interface MagazineColumnProps {
  featured: ArticleCardData | null;
  list: ArticleCardData[];
}

export function MagazineColumn({ featured, list }: MagazineColumnProps) {
  const hasArticles = featured || (list && list.length > 0);

  if (!hasArticles) return null;

  const top3 = (list || []).slice(0, 3);
  const more = (list || []).slice(3, 4);

  return (
    <section className="bg-page py-10">
      <div className="container">
        <SectionHeader title="Tin nổi bật" />
        {featured && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ArticleCard article={featured} variant="featured" priority />
            </div>
            <div className="flex flex-col gap-4">
              {top3.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="horizontal" />
              ))}
            </div>
          </div>
        )}

        {more.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {more.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="featured" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
