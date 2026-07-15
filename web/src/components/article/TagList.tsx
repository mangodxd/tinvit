import Link from 'next/link';

interface TagListProps {
  tags: { name: string; slug: string }[];
}

export function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.slug}
          href={`/search?q=${encodeURIComponent(tag.name)}`}
          className="inline-block px-3 py-1.5 text-small text-meta bg-accent hover:text-primary hover:bg-gray-200 transition-colors uppercase tracking-wider font-body"
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
