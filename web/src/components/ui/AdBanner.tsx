import { cn } from '@/lib/cn';

interface AdBannerProps {
  width?: number;
  height?: number;
  className?: string;
}

export function AdBanner({
  width = 336,
  height = 280,
  className,
}: AdBannerProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-accent border border-gray-200 text-meta text-caption',
        className
      )}
      style={{ width, height }}
      aria-label="Quảng cáo"
    >
      <span>Quảng cáo</span>
    </div>
  );
}
