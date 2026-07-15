import Link from 'next/link';

interface TickerProps {
  items: { slug: string; title: string }[];
}

export function Ticker({ items }: TickerProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-primary text-white overflow-hidden py-2">
      <div className="container flex items-center gap-4">
        <span className="text-small uppercase font-bold shrink-0 font-heading bg-white text-primary px-2 py-0.5 rounded">
          Mới nhất
        </span>
        <div className="overflow-hidden flex-1 relative">
          <div className="flex animate-ticker whitespace-nowrap">
            {[...items, ...items, ...items].map((item, index) => (
              <span key={`${item.slug}-${index}`} className="inline-flex items-center shrink-0">
                <Link
                  href={`/article/${item.slug}`}
                  className="text-small text-white/90 hover:text-white transition-colors"
                >
                  {item.title}
                </Link>
                <span className="mx-4 text-white/40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
