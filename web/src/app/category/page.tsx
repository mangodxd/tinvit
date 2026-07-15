import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { DuckMascot } from '@/components/ui/DuckMascot';
import { CATEGORY_COLORS, CATEGORY_NAMES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Chuyên mục',
  description: 'Danh sách tất cả chuyên mục tin tức',
};

const ALL_CATEGORIES = Object.keys(CATEGORY_NAMES);

export default function CategoryIndexPage() {
  return (
    <>
      <section className="bg-accent py-3">
        <div className="container">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Chuyên mục' },
            ]}
          />
        </div>
      </section>

      <section className="bg-page py-8 lg:py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <DuckMascot size={36} variant="default" />
              <h1 className="text-heading font-bold font-heading text-dark">
                Chuyên mục
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_CATEGORIES.map((slug) => {
                const color = CATEGORY_COLORS[slug] || '#6b7280';
                const name = CATEGORY_NAMES[slug] || slug;
                return (
                  <Link
                    key={slug}
                    href={`/category/${slug}`}
                    className="flex items-center gap-3 bg-surface rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 group cursor-pointer"
                  >
                    <span
                      className="w-3 h-3 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-body font-medium text-dark group-hover:text-primary transition-colors">
                      {name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
