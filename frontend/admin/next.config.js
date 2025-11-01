/** @type {import('next').NextConfig} */
const nextConfig = {
	basePath: '/admin',
	trailingSlash: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default nextConfig;
