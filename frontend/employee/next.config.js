/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/employee',
  trailingSlash: false,
  // put any other Next.js config here
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    trustHostHeader: true,
  },
  allowedDevOrigins: [
    'captain-oven-thumbs-memorabilia.trycloudflare.com',
    // Allow all *.trycloudflare.com subdomains
    /.*\.trycloudflare\.com$/,
  ],
};

module.exports = nextConfig;
