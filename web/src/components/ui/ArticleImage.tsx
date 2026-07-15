'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface ArticleImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  wrapperClassName?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

export function ArticleImage({
  src,
  alt,
  aspectRatio,
  className,
  wrapperClassName,
  fill = true,
  width,
  height,
  priority = false,
  sizes,
}: ArticleImageProps) {
  const [optimizationFailed, setOptimizationFailed] = useState(false);
  const [objectFit, setObjectFit] = useState<'cover' | 'contain'>('cover');

  const handleError = useCallback(() => {
    setOptimizationFailed(true);
  }, []);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    if (img.naturalWidth && img.naturalHeight) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio < 0.85) {
        setObjectFit('contain');
      }
    }
  }, []);

  const ratio = aspectRatio || '4/3';

  if (!src) {
    return (
      <div
        className={cn('bg-gradient-to-br from-accent via-gray-100 to-gray-200', wrapperClassName)}
        style={fill ? { aspectRatio: ratio } : undefined}
        aria-hidden="true"
      />
    );
  }

  if (optimizationFailed) {
    return (
      <div
        className={cn('relative overflow-hidden bg-accent', wrapperClassName)}
        style={fill ? { aspectRatio: ratio } : undefined}
      >
        <img
          src={src}
          alt={alt}
          className={cn('w-full h-full', objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('relative overflow-hidden bg-accent', wrapperClassName)}
      style={fill ? { aspectRatio: ratio } : undefined}
    >
      {fill ? (
        <Image
          src={src}
          alt={alt}
          fill
          quality={80}
          className={cn(objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
          sizes={sizes || '(max-width: 576px) 100vw, (max-width: 992px) 50vw, 100vw'}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width || 1200}
          height={height || 675}
          quality={80}
          className={cn('w-full', objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
          priority={priority}
          onError={handleError}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
}
