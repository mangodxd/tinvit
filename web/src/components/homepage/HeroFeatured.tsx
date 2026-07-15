import { ArticleCard } from '@/components/article/ArticleCard';
import type { ArticleCardData } from '@/lib/types';

interface HeroFeaturedProps {
  hero: ArticleCardData | null;
  featured: ArticleCardData[];
}

export function HeroFeatured({ hero, featured }: HeroFeaturedProps) {
  if (!hero) return null;

  return (
    <section className="bg-surface py-10 lg:py-16">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <ArticleCard article={hero} variant="hero" priority />
          </div>
          <div className="lg:col-span-2 flex flex-col gap-4">
            {featured?.slice(0, 2).map((article) => (
              <ArticleCard key={article.slug} article={article} variant="featured" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
