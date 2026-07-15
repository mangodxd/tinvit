'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArticleImage } from '@/components/ui/ArticleImage';
import { CategoryBadge } from '@/components/ui/Badge';
import type { ArticleCardData } from '@/lib/types';

interface VideoSectionProps {
  videos: ArticleCardData[];
}

function isHls(url: string): boolean {
  return url.includes('.m3u8') || url.includes('master.m3u8');
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?#]+)/);
  return match ? match[1] : null;
}

function HlsVideo({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: any = null;
    const video = videoRef.current;
    if (!video) return;

    import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        video.play().catch(() => {});
      }
    });

    return () => {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full h-full object-contain bg-black"
      title={title}
    />
  );
}

function VideoCard({ video }: { video: ArticleCardData }) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPlaying(true);
  }, []);

  const youtubeId = video.video_url ? getYouTubeId(video.video_url) : null;
  const hasHlsVideo = video.video_url ? isHls(video.video_url) : false;

  return (
    <Link
      href={`/article/${video.slug}`}
      className="block relative overflow-hidden bg-dark aspect-video rounded-lg group cursor-pointer"
    >
      {!playing ? (
        <>
          {video.image_url && (
            <ArticleImage
              src={video.image_url}
              alt={video.title}
              fill
              className="opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {(youtubeId || hasHlsVideo) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                role="button"
                tabIndex={0}
                onClick={handlePlay}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePlay(e as any);
                  }
                }}
                className="w-14 h-14 flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all rounded-full"
                aria-label={`Xem video: ${video.title}`}
              >
                <svg className="w-6 h-6 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <CategoryBadge name={video.category_name} slug={video.category_slug} size="sm" />
            <h3 className="text-caption font-medium text-white mt-1 line-clamp-2 font-heading">
              {video.title}
            </h3>
          </div>
        </>
      ) : (
        <div className="w-full h-full">
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : hasHlsVideo ? (
            <HlsVideo src={video.video_url!} title={video.title} />
          ) : null}
        </div>
      )}
    </Link>
  );
}

export function VideoSection({ videos }: VideoSectionProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="bg-surface py-8">
      <div className="container">
        <SectionHeader title="Video" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.slice(0, 3).map((video) => (
            <VideoCard key={video.slug} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}
