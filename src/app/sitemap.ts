import type { MetadataRoute } from "next";

import { db } from "@/lib/db";
import { posts, properties } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casalia.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Static pages
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: BASE_URL,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${BASE_URL}/comprar`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/alquilar`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${BASE_URL}/vender`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/calculadora-hipoteca`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${BASE_URL}/blog`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/team-casalia`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		// Legal pages
		{
			url: `${BASE_URL}/aviso-legal`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/privacidad`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${BASE_URL}/cookies`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// Dynamic pages from database (with error handling for build without DB)
	let propertyPagesComprar: MetadataRoute.Sitemap = [];
	let propertyPagesAlquilar: MetadataRoute.Sitemap = [];
	let blogPages: MetadataRoute.Sitemap = [];

	try {
		// Get all properties for sale
		const propertiesForSale = await db
			.select({
				slug: properties.slug,
				updatedAt: properties.updatedAt,
			})
			.from(properties)
			.where(eq(properties.operationType, "venta"));

		propertyPagesComprar = propertiesForSale.map((property) => ({
			url: `${BASE_URL}/comprar/${property.slug}`,
			lastModified: property.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.8,
		}));

		// Get all properties for rent
		const propertiesForRent = await db
			.select({
				slug: properties.slug,
				updatedAt: properties.updatedAt,
			})
			.from(properties)
			.where(eq(properties.operationType, "alquiler"));

		propertyPagesAlquilar = propertiesForRent.map((property) => ({
			url: `${BASE_URL}/alquilar/${property.slug}`,
			lastModified: property.updatedAt,
			changeFrequency: "weekly" as const,
			priority: 0.8,
		}));

		// Get all published blog posts
		const publishedPosts = await db
			.select({
				slug: posts.slug,
				updatedAt: posts.updatedAt,
			})
			.from(posts)
			.where(eq(posts.status, "publicado"));

		blogPages = publishedPosts.map((post) => ({
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: post.updatedAt,
			changeFrequency: "monthly" as const,
			priority: 0.7,
		}));
	} catch {
		// Database not available, return only static pages
		console.warn("Sitemap: Database not available, returning only static pages");
	}

	return [
		...staticPages,
		...propertyPagesComprar,
		...propertyPagesAlquilar,
		...blogPages,
	];
}
