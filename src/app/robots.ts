import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casalia.org";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/admin/",
					"/auth/",
					"/api/",
					"/_next/",
					"/private/",
				],
			},
			{
				userAgent: "GPTBot",
				disallow: ["/"], // Block AI crawlers if needed
			},
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
