'use client';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-2xl font-bold text-dark font-heading">Đã có lỗi xảy ra</h1>
      <p className="text-meta mt-2 text-center">
        Không thể tải dữ liệu. Vui lòng thử lại sau.
      </p>
      <button
        onClick={reset}
        className="mt-6 px-6 py-3 bg-primary text-white font-medium hover:opacity-90 transition-opacity"
      >
        Thử lại
      </button>
    </div>
  );
}
