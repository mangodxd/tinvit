import { ArticleImage } from '@/components/ui/ArticleImage';
import type { ArticleContentBlock } from '@/lib/types';

interface ArticleBodyProps {
  content: ArticleContentBlock[];
  skipFirstImage?: string;
}

function renderBlock(block: ArticleContentBlock, index: number) {
  switch (block.type) {
    case 'text':
      return (
        <p key={index} className="mb-5 text-body leading-relaxed text-base font-body">
          {block.content}
        </p>
      );
    case 'image':
      return (
        <figure key={index} className="my-6">
          <div className="rounded-md overflow-hidden bg-accent">
            <ArticleImage
              src={block.src || block.url || ''}
              alt={block.caption || ''}
              fill
            />
          </div>
          {block.caption && (
            <figcaption className="text-center text-sm text-meta mt-2 font-body">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-primary pl-4 italic my-6 text-lg text-meta font-body"
        >
          <p>{block.content}</p>
          {block.author && (
            <footer className="text-caption text-meta mt-2 not-italic">
              — {block.author}
            </footer>
          )}
        </blockquote>
      );
    case 'heading': {
      const Tag = block.level === 2 ? 'h2' : block.level === 3 ? 'h3' : 'h4';
      const sizeClass =
        block.level === 2
          ? 'text-2xl font-bold text-dark mt-8 mb-4'
          : block.level === 3
          ? 'text-xl font-semibold text-dark mt-6 mb-3'
          : 'text-lg font-semibold text-dark mt-4 mb-2';
      return (
        <Tag key={index} className={`${sizeClass} font-heading`}>
          {block.text}
        </Tag>
      );
    }
    default:
      return null;
  }
}

export function ArticleBody({ content, skipFirstImage }: ArticleBodyProps) {
  if (!content || content.length === 0) return null;

  let skippedHero = false;
  const filtered = content.filter((block) => {
    if (skipFirstImage && block.type === 'image' && !skippedHero) {
      if (block.src === skipFirstImage || block.url === skipFirstImage) {
        skippedHero = true;
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) return null;

  return (
    <div className="max-w-prose mx-auto">
      {filtered.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
