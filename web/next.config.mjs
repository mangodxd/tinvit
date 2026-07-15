/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    deviceSizes: [375, 640, 750, 1080, 1200, 1920, 2560],
    imageSizes: [80, 200, 400, 600, 800, 1200],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
