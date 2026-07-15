import Link from 'next/link';
import type { Category } from '@/lib/types';

interface CategoryPillsProps {
  categories: Category[];
}

export function CategoryPills({ categories }: CategoryPillsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="shrink-0 px-4 py-2 rounded-full text-caption font-medium bg-surface border border-gray-200 hover:border-primary hover:text-primary transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
