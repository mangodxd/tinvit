import Link from 'next/link';
import { CategoryBadge } from '@/components/ui/Badge';
import { ArticleImage } from '@/components/ui/ArticleImage';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/cn';
import type { ArticleCardData } from '@/lib/types';

interface ArticleCardProps {
  article: ArticleCardData;
  variant?: 'featured' | 'horizontal' | 'hero';
  priority?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'horizontal',
  priority = false,
  className,
}: ArticleCardProps) {
  const { slug, title, excerpt, image_url, category_name, category_slug, published_at } = article;

  if (variant === 'hero') {
    return (
      <article className={cn('relative overflow-hidden bg-dark min-h-[400px] lg:min-h-[480px] rounded-lg group', className)}>
        {image_url && (
          <ArticleImage
            src={image_url}
            alt={title}
            fill
            aspectRatio="auto"
            className="opacity-80 group-hover:scale-105 transition-transform duration-500"
            wrapperClassName="absolute inset-0"
            sizes="100vw"
            priority={priority}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <CategoryBadge name={category_name} slug={category_slug} size="lg" />
          <h2 className="text-title md:text-display font-bold text-white mt-3 font-heading line-clamp-3">
            <Link href={`/article/${slug}`} className="hover:underline cursor-pointer">
              {title}
            </Link>
          </h2>
          {excerpt && (
            <p className="text-caption text-white/80 mt-2 line-clamp-2 max-w-2xl font-body">
              {excerpt}
            </p>
          )}
          <span className="text-small text-white/60 mt-2 block">
            {formatRelativeTime(published_at)}
          </span>
        </div>
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className={cn('relative overflow-hidden bg-surface shadow-card rounded-lg h-full flex flex-col group hover:shadow-lg transition-shadow duration-200', className)}>
        <Link href={`/article/${slug}`} className="block flex flex-col h-full cursor-pointer">
          <div className="aspect-[4/3] relative overflow-hidden bg-accent">
            {image_url ? (
              <ArticleImage
                src={image_url}
                alt={title}
                fill
                className="transition-transform duration-300 group-hover:scale-105"
                priority={priority}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent to-gray-200" />
            )}
          </div>
          <div className="p-4 md:p-6 flex flex-col flex-1">
            <CategoryBadge name={category_name} slug={category_slug} size="sm" />
            <h3 className="text-subheading font-medium text-dark mt-2 font-heading line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            {excerpt && (
              <p className="text-caption text-meta mt-2 line-clamp-2 font-body">
                {excerpt}
              </p>
            )}
            <span className="text-small text-meta mt-auto pt-3 block">
              {formatRelativeTime(published_at)}
            </span>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className={cn('flex gap-4 bg-surface py-4 border-b border-gray-100 last:border-0 group hover:bg-gray-50 transition-colors duration-200', className)}>
        <Link
          href={`/article/${slug}`}
          className="shrink-0 w-[200px] max-w-[40%] overflow-hidden rounded-lg bg-accent cursor-pointer"
        >
          <div className="aspect-[4/3] relative">
            {image_url ? (
              <ArticleImage
                src={image_url}
                alt={title}
                fill
                className="transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent to-gray-200" />
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0 flex flex-col">
          <CategoryBadge name={category_name} slug={category_slug} size="sm" />
          <h3 className="text-subheading font-medium text-dark mt-1 font-heading line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors duration-200">
            <Link href={`/article/${slug}`} className="cursor-pointer">{title}</Link>
          </h3>
          {excerpt && (
            <p className="text-caption text-meta mt-1 line-clamp-2 font-body leading-relaxed">
              {excerpt}
            </p>
          )}
          <span className="text-small text-meta mt-auto pt-1 block">
            {formatRelativeTime(published_at)}
          </span>
        </div>
      </article>
    );
  }

  return null;
}
