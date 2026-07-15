'use client';

import { HeroFeatured } from '@/components/homepage/HeroFeatured';
import { MagazineColumn } from '@/components/homepage/MagazineColumn';
import { VideoSection } from '@/components/homepage/VideoSection';
import { Ticker } from '@/components/homepage/Ticker';
import { CategoryPills } from '@/components/homepage/CategoryPills';
import { Sidebar } from '@/components/layout/Sidebar';
import { FadeIn } from '@/components/ui';
import type { HomepageResponse } from '@/lib/types';

interface HomepageClientProps {
  data: HomepageResponse;
}

export function HomepageClient({ data }: HomepageClientProps) {
  const tickerItems = data.hero_secondary.slice(0, 2).concat(data.featured.list.slice(0, 3)).map((a) => ({
    slug: a.slug,
    title: a.title,
  }));

  return (
    <>
      {tickerItems.length > 0 && <Ticker items={tickerItems} />}

      <CategoryPills categories={data.categories.meta} />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 min-w-0 space-y-0">
            <FadeIn>
              <HeroFeatured
                hero={data.hero}
                featured={data.hero_secondary}
              />
            </FadeIn>

            <FadeIn delay={100}>
              <MagazineColumn
                featured={data.featured.article}
                list={data.featured.list}
              />
            </FadeIn>

            {data.videos && data.videos.length > 0 && (
              <FadeIn delay={200}>
                <VideoSection videos={data.videos} />
              </FadeIn>
            )}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-20">
              <Sidebar
                recentArticles={data.latest}
                categories={data.categories.meta}
                tags={data.tags}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
