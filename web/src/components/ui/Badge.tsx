import Link from 'next/link';
import { cn } from '@/lib/cn';
import { getCategoryColor } from '@/lib/constants';

interface CategoryBadgeProps {
  name: string;
  slug: string | null;
  size?: 'sm' | 'md' | 'lg';
  linkable?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-small px-1 py-0.5',
  md: 'text-caption px-2 py-1',
  lg: 'text-caption px-3 py-1.5',
};

export function CategoryBadge({
  name,
  slug,
  size = 'md',
  linkable = false,
  className,
}: CategoryBadgeProps) {
  const color = getCategoryColor(slug);

  const base = cn(
    'inline-block font-body font-medium uppercase tracking-wide text-white',
    sizeClasses[size],
    className
  );

  const style = { backgroundColor: color };

  if (linkable && slug) {
    return (
      <Link
        href={`/category/${slug}`}
        className={cn(base, 'hover:brightness-90 transition-[filter] duration-150')}
        style={style}
        aria-label={`Xem bài viết chuyên mục ${name}`}
      >
        {name}
      </Link>
    );
  }

  return (
    <span className={base} style={style}>
      {name}
    </span>
  );
}
