import Link from 'next/link';
import { Navigation } from '@/components/layout/Navigation';
import { SearchBar } from '@/components/layout/SearchBar';
import { MobileNav } from '@/components/layout/MobileNav';
import { DuckMascot } from '@/components/ui/DuckMascot';
import { SITE_NAME } from '@/lib/constants';

export function Header() {
  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100">
      <div className="container flex items-center justify-between h-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-heading font-bold font-heading text-dark hover:text-primary transition-colors duration-200"
        >
          <DuckMascot size={28} variant="default" />
          {SITE_NAME}
        </Link>

        <Navigation />

        <div className="flex items-center gap-2">
          <SearchBar variant="header" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

