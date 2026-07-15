import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PrevNextNavProps {
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-200 pt-6 mt-8">
      {prev ? (
        <Link
          href={`/article/${prev.slug}`}
          className="flex items-center gap-2 text-caption text-meta hover:text-primary transition-colors group max-w-[45%]"
        >
          <ChevronLeft className="w-5 h-5 shrink-0" />
          <span className="line-clamp-2 font-body">{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/article/${next.slug}`}
          className="flex items-center gap-2 text-caption text-meta hover:text-primary transition-colors group max-w-[45%] sm:text-right"
        >
          <span className="line-clamp-2 font-body">{next.title}</span>
          <ChevronRight className="w-5 h-5 shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
