import { cn } from '@/lib/cn';

interface SkeletonProps {
  variant?: 'card' | 'hero' | 'list' | 'sidebar' | 'text' | 'badge';
  className?: string;
}

const baseClasses = 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded-lg';

function SkeletonCard() {
  return (
    <div className="space-y-3">
      <div className={`${baseClasses} aspect-[16/9] w-full`} />
      <div className={`${baseClasses} h-5 w-1/3`} />
      <div className={`${baseClasses} h-5 w-full`} />
      <div className={`${baseClasses} h-5 w-3/4`} />
      <div className={`${baseClasses} h-4 w-1/4`} />
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="space-y-2">
      <div className={`${baseClasses} aspect-[16/7] w-full`} />
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex gap-4">
      <div className={`${baseClasses} w-[200px] aspect-[4/3] shrink-0`} />
      <div className="flex-1 space-y-2">
        <div className={`${baseClasses} h-5 w-1/4`} />
        <div className={`${baseClasses} h-5 w-full`} />
        <div className={`${baseClasses} h-5 w-full`} />
        <div className={`${baseClasses} h-4 w-1/3`} />
      </div>
    </div>
  );
}

function SkeletonSidebar() {
  return (
    <div className="flex gap-3 items-start">
      <div className={`${baseClasses} w-20 h-20 shrink-0`} />
      <div className="flex-1 space-y-2">
        <div className={`${baseClasses} h-4 w-full`} />
        <div className={`${baseClasses} h-4 w-3/4`} />
        <div className={`${baseClasses} h-3 w-1/3`} />
      </div>
    </div>
  );
}

function SkeletonText() {
  return (
    <div className="space-y-2">
      <div className={`${baseClasses} h-4 w-full`} />
      <div className={`${baseClasses} h-4 w-11/12`} />
      <div className={`${baseClasses} h-4 w-4/5`} />
      <div className={`${baseClasses} h-4 w-3/4`} />
      <div className={`${baseClasses} h-4 w-2/5`} />
    </div>
  );
}

function SkeletonBadge() {
  return <div className={`${baseClasses} h-6 w-20`} />;
}

const variants = {
  card: SkeletonCard,
  hero: SkeletonHero,
  list: SkeletonList,
  sidebar: SkeletonSidebar,
  text: SkeletonText,
  badge: SkeletonBadge,
};

export function Skeleton({ variant = 'card', className }: SkeletonProps) {
  const Component = variants[variant];
  return (
    <div className={className} aria-hidden="true">
      <Component />
    </div>
  );
}
