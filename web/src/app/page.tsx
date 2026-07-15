import { Suspense } from 'react';
import { getHomepage } from '@/fetchers/home';
import { HomepageClient } from '@/components/homepage/HomepageClient';
import { Skeleton, EmptyState } from '@/components/ui';

interface Props {
  searchParams: { category?: string };
}

async function HomepageContent() {
  try {
    const data = await getHomepage();
    return <HomepageClient data={data} />;
  } catch {
    return (
      <section className="bg-page py-12">
        <div className="container">
          <EmptyState
            title="Không thể tải tin tức"
            description="Hiện tại không thể kết nối đến máy chủ. Vui lòng thử lại sau."
            action={{ label: 'Thử lại', href: '/' }}
          />
        </div>
      </section>
    );
  }
}

function HomepageSkeleton() {
  return (
    <div className="bg-page py-12">
      <div className="container space-y-12">
        <Skeleton variant="hero" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ searchParams }: Props) {
  return (
    <Suspense fallback={<HomepageSkeleton />}>
      <HomepageContent />
    </Suspense>
  );
}
