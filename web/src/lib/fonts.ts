import { Be_Vietnam_Pro } from 'next/font/google';

export const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
  preload: true,
});

// Re-export for body as well - same font, different weights
export const beVietnamProBody = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
  preload: false,
});
