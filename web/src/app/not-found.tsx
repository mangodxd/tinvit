import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-hero font-bold text-gray-300 font-heading">404</h1>
      <h2 className="text-xl font-bold text-dark mt-4 font-heading">Trang không tìm thấy</h2>
      <p className="text-meta mt-2 text-center">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
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
