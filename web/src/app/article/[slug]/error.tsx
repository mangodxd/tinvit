'use client';

import Link from 'next/link';

export default function ArticleError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-2xl font-bold text-dark font-heading">Không thể tải bài viết</h1>
      <p className="text-meta mt-2 text-center">
        Bài viết này hiện không khả dụng. Vui lòng thử lại sau.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-primary text-white font-medium hover:opacity-90 transition-opacity"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
