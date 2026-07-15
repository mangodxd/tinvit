import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

const headingVariants = cva('font-heading transition-colors duration-300', {
  variants: {
    size: {
      hero: 'text-hero',
      display: 'text-display',
      title: 'text-title',
      heading: 'text-heading',
      subheading: 'text-subheading',
    },
    weight: {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    color: {
      dark: 'text-dark',
      body: 'text-body',
      meta: 'text-meta',
      light: 'text-white',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    size: 'heading',
    weight: 'semibold',
    color: 'dark',
  },
});

interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function Heading({
  as: Tag = 'h2',
  size,
  weight,
  color,
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ size, weight, color }), className)} {...props}>
      {children}
    </Tag>
  );
}
