import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title?: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title = 'Không tìm thấy',
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" role="status">
      {Icon && (
        <span className="mb-4 text-primary/60" aria-hidden="true">
          <Icon className="w-12 h-12" />
        </span>
      )}
      <h3 className="text-lg font-bold text-dark font-heading">{title}</h3>
      {description && (
        <p className="text-caption text-meta mt-2 text-center max-w-md">
          {description}
        </p>
      )}
      {action && (
        action.href ? (
          <Link
            href={action.href}
            className="mt-6 px-6 py-3 bg-primary text-white font-medium text-caption hover:opacity-90 transition-opacity"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="mt-6 px-6 py-3 bg-primary text-white font-medium text-caption hover:opacity-90 transition-opacity"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );
}
