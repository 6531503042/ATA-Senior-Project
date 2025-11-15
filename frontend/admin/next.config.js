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
	allowedDevOrigins: [
		'captain-oven-thumbs-memorabilia.trycloudflare.com',
		// Allow all *.trycloudflare.com subdomains
		/.*\.trycloudflare\.com$/,
	],
};

export default nextConfig;
