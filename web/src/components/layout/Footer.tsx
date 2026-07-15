import Link from 'next/link';
import { SITE_NAME, SITE_DESCRIPTION, CATEGORY_NAMES } from '@/lib/constants';
import type { ArticleCardData, Category } from '@/lib/types';

interface FooterProps {
  categories?: Category[];
  recentArticles?: ArticleCardData[];
}

const FALLBACK_CATEGORIES = Object.entries(CATEGORY_NAMES).map(([slug, name]) => ({ slug, name }));

export function Footer({ categories, recentArticles }: FooterProps) {
  const displayCategories = (categories ?? FALLBACK_CATEGORIES).slice(0, 8);
  const recent = recentArticles?.slice(0, 6);

  return (
    <footer className="bg-footer text-footer-text">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold text-heading font-heading mb-4">
              {SITE_NAME}
            </h3>
            <p className="text-caption leading-relaxed">
              {SITE_DESCRIPTION}
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold text-heading font-heading mb-4">
              Danh mục
            </h3>
            <ul className="space-y-2">
              {displayCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-caption text-footer-text hover:text-white transition-colors duration-300"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold text-heading font-heading mb-4">
              Theo dõi chúng tôi
            </h3>
            <p className="text-caption text-footer-text leading-relaxed mb-4">
              Tổng hợp tin tức mới nhất từ các nguồn báo uy tín Việt Nam.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="RSS">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.37 20 6.18 20C5 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors" aria-label="Email">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700">
        <div className="container py-4">
          <p className="text-small text-footer-text text-center">
            © {new Date().getFullYear()} {SITE_NAME}. Tin tức được tổng hợp tự động từ các nguồn báo.
          </p>
        </div>
      </div>
    </footer>
  );
}

