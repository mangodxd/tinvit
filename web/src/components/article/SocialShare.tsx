'use client';

import { useState, useEffect } from 'react';
import { Share2, Link, Facebook, Twitter } from 'lucide-react';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator);
  }, []);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-2">
      <span className="text-caption text-meta font-medium mr-1 font-body">Chia sẻ:</span>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-meta hover:text-primary transition-colors"
        aria-label="Chia sẻ lên Facebook"
      >
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 text-meta hover:text-primary transition-colors"
        aria-label="Chia sẻ lên Twitter"
      >
        <Twitter className="w-5 h-5" />
      </a>

      <button
        onClick={handleCopyLink}
        className="p-2 text-meta hover:text-primary transition-colors relative"
        aria-label={copied ? 'Đã sao chép' : 'Sao chép liên kết'}
      >
        <Link className="w-5 h-5" />
        {copied && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-dark text-white text-small px-2 py-1 whitespace-nowrap">
            Đã sao chép
          </span>
        )}
      </button>

      {canShare && (
        <button
          onClick={handleNativeShare}
          className="p-2 text-meta hover:text-primary transition-colors"
          aria-label="Chia sẻ"
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
