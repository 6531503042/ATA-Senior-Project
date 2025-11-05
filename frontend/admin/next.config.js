/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '/admin',
	trailingSlash: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		trustHostHeader: true,
	},
};

export default nextConfig;
