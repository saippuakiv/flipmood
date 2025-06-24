import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'placehold.co',
      'i.scdn.co',
      'image.tmdb.org',
      'www.themoviedb.org',
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable ESLint checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during build (optional)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
