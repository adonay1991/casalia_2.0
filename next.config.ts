import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ["@phosphor-icons/react"],
	},
	images: {
		// Modern image formats for better compression
		formats: ["image/avif", "image/webp"],
		// Device sizes for responsive images
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
		// Smaller sizes for thumbnails
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
			},
			{
				protocol: "https",
				hostname: "*.supabase.co",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				// Local Supabase storage
				protocol: "http",
				hostname: "127.0.0.1",
				port: "54321",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "54321",
			},
		],
	},
	// Note: React Compiler requires babel-plugin-react-compiler
	// Uncomment when ready: reactCompiler: true,
	// Compress responses
	compress: true,
	// Generate ETags for caching
	generateEtags: true,
	// HTTP headers for caching and security
	async headers() {
		return [
			{
				source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
				],
			},
		];
	},
};

export default nextConfig;
