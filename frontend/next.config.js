/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Disable the built-in image optimization to avoid sharp dependency issues
    unoptimized: true,
  },
  // Disable TypeScript and ESLint checks during build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig; 