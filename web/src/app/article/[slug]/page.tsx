import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getArticle, getRelatedArticles } from '@/fetchers/article';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { CategoryBadge, ReadingProgress } from '@/components/ui';
import { ArticleImage } from '@/components/ui/ArticleImage';
import { ArticleMeta, ArticleBody, TagList, SocialShare, PrevNextNav, JsonLd } from '@/components/article';
import { Skeleton } from '@/components/ui';
import { getCategoryName } from '@/lib/constants';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const article = await getArticle(params.slug);
    return {
      title: article.title,
      description: article.description,
      openGraph: {
        title: article.title,
        description: article.description,
        type: 'article',
        publishedTime: article.published_at,
        images: [{ url: article.image_url }],
      },
    };
  } catch {
    return { title: 'Bài viết' };
  }
}

async function ArticleContent({ slug }: { slug: string }) {
  let article;
  try {
    article = await getArticle(slug);
  } catch {
    notFound();
  }

  const [related] = await Promise.all([
    getRelatedArticles(slug).catch(() => []),
  ]);

  return (
    <>
      <ReadingProgress />

      <section className="bg-accent py-3">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: getCategoryName(article.category_slug), href: article.category_slug ? `/category/${article.category_slug}` : undefined },
              { label: article.title },
            ]}
          />
        </div>
      </section>

      <JsonLd
        title={article.title}
        description={article.description}
        imageUrl={article.image_url}
        publishedAt={article.published_at}
        sourceName={article.source_name}
        slug={article.slug}
      />

      <article className="bg-surface py-6 lg:py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto">
              {article.image_url && (
                <div className="relative aspect-[16/9] overflow-hidden mb-5 bg-accent">
                  <ArticleImage
                    src={article.image_url}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                  />
                  <div className="absolute top-4 left-4">
                    <CategoryBadge
                      name={article.category_name}
                      slug={article.category_slug}
                      size="lg"
                      linkable
                    />
                  </div>
                </div>
              )}

              <h1 className="text-title md:text-display font-bold text-dark font-heading leading-tight text-balance">
                {article.title}
              </h1>

              <div className="mt-3">
                <ArticleMeta
                  source={article.source_name}
                  publishedAt={article.published_at}
                  views={article.view_count}
                />
              </div>

              {article.description && (
                <p className="mt-4 text-body text-meta leading-relaxed border-l-3 border-primary pl-4 italic">
                  {article.description}
                </p>
              )}

              <div className="mt-6 lg:mt-8">
                <ArticleBody content={article.content || []} skipFirstImage={article.image_url} />
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <TagList tags={article.tags} />
                </div>
              )}

              <div className="mt-6">
                <SocialShare
                  url={`/article/${article.slug}`}
                  title={article.title}
                />
              </div>

              <PrevNextNav
                prev={article.prev_article}
                next={article.next_article}
              />

              {related.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h2 className="text-heading font-bold text-dark font-heading mb-4">
                    Bài viết liên quan
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.slice(0, 4).map((item) => (
                      <a
                        key={item.slug}
                        href={`/article/${item.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-20 h-20 shrink-0 overflow-hidden rounded bg-accent relative">
                          {item.image_url ? (
                            <ArticleImage
                              src={item.image_url}
                              alt=""
                              fill
                              sizes="80px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent to-gray-200" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-caption font-medium text-dark group-hover:text-primary transition-colors line-clamp-2 font-heading">
                            {item.title}
                          </h3>
                          <span className="text-small text-meta">{item.source_name}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </article>
    </>
  );
}

function ArticleSkeleton() {
  return (
    <div className="bg-surface py-8">
      <div className="container">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton variant="hero" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
        </div>
      </div>
    </div>
  );
}

export default function ArticlePage({ params }: Props) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleContent slug={params.slug} />
    </Suspense>
  );
}
