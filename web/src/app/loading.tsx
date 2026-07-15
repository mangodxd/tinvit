'use client';

import { useState, useEffect } from 'react';
import { DuckMascot } from '@/components/ui/DuckMascot';

export default function RootLoading() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 150);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-page min-h-[60vh] flex items-center justify-center animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4">
        <DuckMascot size={64} variant="default" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-heading font-bold font-heading text-dark">
            Tin Vịt
          </p>
          <p className="text-caption text-meta">Đang tải tin tức...</p>
        </div>
      </div>
    </div>
  );
}
