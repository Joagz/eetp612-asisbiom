const API_URL = process.env.NEXT_PUBLIC_API_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${API_URL}/api/:path*`,
			},
		]
	},
};

export default nextConfig;
