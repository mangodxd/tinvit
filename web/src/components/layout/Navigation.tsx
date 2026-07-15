'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/cn';

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Chính" className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'text-caption font-medium uppercase tracking-wide transition-colors duration-300 font-body',
                  isActive
                    ? 'text-primary'
                    : 'text-dark hover:text-primary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
