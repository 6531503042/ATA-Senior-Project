/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/employee',
  trailingSlash: false,
  // put any other Next.js config here
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
