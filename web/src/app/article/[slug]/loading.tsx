import { Skeleton } from '@/components/ui/Skeleton';

export default function ArticleLoading() {
  return (
    <div className="bg-surface py-8">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="hero" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" />
          </div>
          <div className="space-y-4">
            <Skeleton variant="sidebar" />
            <Skeleton variant="sidebar" />
            <Skeleton variant="sidebar" />
          </div>
        </div>
      </div>
    </div>
  );
}
