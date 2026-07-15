import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  title: string;
  color?: string;
  link?: {
    href: string;
    label?: string;
  };
  className?: string;
}

export function SectionHeader({
  title,
  color,
  link,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-6', className)}>
      <div className="flex items-center gap-2">
        <Heading as="h2" size="heading" weight="semibold" color="dark">
          {title}
        </Heading>
      </div>
      {link && (
        <Link
          href={link.href}
          className="text-caption text-meta hover:text-primary transition-colors duration-300"
        >
          {link.label || 'Xem tất cả'} →
        </Link>
      )}
    </div>
  );
}
