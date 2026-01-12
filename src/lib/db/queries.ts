/**
 * Database Queries
 *
 * Type-safe database queries using Drizzle ORM.
 * All queries are server-side only.
 */

import { and, asc, count, desc, eq, gte, ilike, lte, or } from "drizzle-orm";

import { db } from "./index";
import {
	type Post,
	type Property,
	type PropertyImage,
	posts,
	properties,
	propertyImages,
} from "./schema";

// ===========================================
// Property Queries
// ===========================================

export type PropertyWithImages = Property & {
	images: PropertyImage[];
};

export type SortOption =
	| "destacado"
	| "reciente"
	| "precio-asc"
	| "precio-desc"
	| "superficie-desc";

interface GetPropertiesOptions {
	operationType?: "venta" | "alquiler";
	propertyType?: Property["propertyType"];
	status?: Property["status"];
	zone?: string;
	minPrice?: number;
	maxPrice?: number;
	minBedrooms?: number;
	highlighted?: boolean;
	sortBy?: SortOption;
	limit?: number;
	offset?: number;
}

/**
 * Get properties with optional filters
 */
export async function getProperties(
	options: GetPropertiesOptions = {},
): Promise<PropertyWithImages[]> {
	const {
		operationType,
		propertyType,
		status = "disponible",
		zone,
		minPrice,
		maxPrice,
		minBedrooms,
		highlighted,
		sortBy = "destacado",
		limit = 12,
		offset = 0,
	} = options;

	// Build where conditions
	const conditions = [];

	if (operationType) {
		conditions.push(eq(properties.operationType, operationType));
	}

	if (propertyType) {
		conditions.push(eq(properties.propertyType, propertyType));
	}

	if (status) {
		conditions.push(eq(properties.status, status));
	}

	if (zone) {
		conditions.push(ilike(properties.zone, `%${zone}%`));
	}

	if (highlighted !== undefined) {
		conditions.push(eq(properties.isHighlighted, highlighted));
	}

	// Build orderBy based on sortBy option
	const getOrderBy = () => {
		switch (sortBy) {
			case "reciente":
				return [desc(properties.publishedAt)];
			case "precio-asc":
				return [asc(properties.price)];
			case "precio-desc":
				return [desc(properties.price)];
			case "superficie-desc":
				return [desc(properties.sqmBuilt)];
			case "destacado":
			default:
				return [desc(properties.isHighlighted), desc(properties.publishedAt)];
		}
	};

	// Get properties
	const result = await db.query.properties.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		with: {
			images: {
				orderBy: (images, { asc: imgAsc }) => [imgAsc(images.order)],
			},
		},
		orderBy: getOrderBy(),
		limit,
		offset,
	});

	// Apply price and bedroom filters in memory (Drizzle decimal comparison is tricky)
	let filtered = result;

	if (minPrice !== undefined) {
		filtered = filtered.filter((p) => Number.parseFloat(p.price) >= minPrice);
	}

	if (maxPrice !== undefined) {
		filtered = filtered.filter((p) => Number.parseFloat(p.price) <= maxPrice);
	}

	if (minBedrooms !== undefined) {
		filtered = filtered.filter(
			(p) => p.bedrooms !== null && p.bedrooms >= minBedrooms,
		);
	}

	return filtered;
}

/**
 * Count properties matching filters (for pagination)
 */
export async function countProperties(
	options: Omit<GetPropertiesOptions, "limit" | "offset"> = {},
): Promise<number> {
	const {
		operationType,
		propertyType,
		status = "disponible",
		zone,
		minPrice,
		maxPrice,
		minBedrooms,
		highlighted,
	} = options;

	// Build where conditions
	const conditions = [];

	if (operationType) {
		conditions.push(eq(properties.operationType, operationType));
	}

	if (propertyType) {
		conditions.push(eq(properties.propertyType, propertyType));
	}

	if (status) {
		conditions.push(eq(properties.status, status));
	}

	if (zone) {
		conditions.push(ilike(properties.zone, `%${zone}%`));
	}

	if (highlighted !== undefined) {
		conditions.push(eq(properties.isHighlighted, highlighted));
	}

	// Note: price and bedroom filters are applied in memory in getProperties
	// For accurate count with these filters, we'd need to fetch all and filter
	// For now, we return the DB count (may be slightly higher with filters)
	const result = await db
		.select({ value: count() })
		.from(properties)
		.where(conditions.length > 0 ? and(...conditions) : undefined);

	return result[0]?.value ?? 0;
}

/**
 * Get highlighted/featured properties
 */
export async function getFeaturedProperties(
	limit = 6,
): Promise<PropertyWithImages[]> {
	return getProperties({
		highlighted: true,
		status: "disponible",
		limit,
	});
}

/**
 * Get properties for sale
 */
export async function getPropertiesForSale(
	options: Omit<GetPropertiesOptions, "operationType"> = {},
): Promise<PropertyWithImages[]> {
	return getProperties({
		...options,
		operationType: "venta",
	});
}

/**
 * Count properties for sale
 */
export async function countPropertiesForSale(
	options: Omit<
		GetPropertiesOptions,
		"operationType" | "limit" | "offset"
	> = {},
): Promise<number> {
	return countProperties({
		...options,
		operationType: "venta",
	});
}

/**
 * Get properties for rent
 */
export async function getPropertiesForRent(
	options: Omit<GetPropertiesOptions, "operationType"> = {},
): Promise<PropertyWithImages[]> {
	return getProperties({
		...options,
		operationType: "alquiler",
	});
}

/**
 * Count properties for rent
 */
export async function countPropertiesForRent(
	options: Omit<
		GetPropertiesOptions,
		"operationType" | "limit" | "offset"
	> = {},
): Promise<number> {
	return countProperties({
		...options,
		operationType: "alquiler",
	});
}

/**
 * Get a single property by slug
 */
export async function getPropertyBySlug(
	slug: string,
): Promise<PropertyWithImages | null> {
	const result = await db.query.properties.findFirst({
		where: eq(properties.slug, slug),
		with: {
			images: {
				orderBy: (images, { asc }) => [asc(images.order)],
			},
		},
	});

	return result || null;
}

/**
 * Get similar properties (same zone and type, excluding current)
 */
export async function getSimilarProperties(
	property: Property,
	limit = 3,
): Promise<PropertyWithImages[]> {
	const result = await db.query.properties.findMany({
		where: and(
			eq(properties.operationType, property.operationType),
			eq(properties.status, "disponible"),
			or(
				eq(properties.propertyType, property.propertyType),
				property.zone
					? ilike(properties.zone, `%${property.zone}%`)
					: undefined,
			),
		),
		with: {
			images: {
				orderBy: (images, { asc }) => [asc(images.order)],
			},
		},
		limit: limit + 1, // Get one extra in case we need to filter out current
	});

	// Filter out current property and limit
	return result.filter((p) => p.id !== property.id).slice(0, limit);
}

/**
 * Get all property slugs (for static generation)
 */
export async function getAllPropertySlugs(): Promise<
	{ slug: string; operationType: string }[]
> {
	try {
		const result = await db
			.select({
				slug: properties.slug,
				operationType: properties.operationType,
			})
			.from(properties);

		return result;
	} catch {
		// Return empty array if DB is not available (allows build without DB)
		console.warn("getAllPropertySlugs: Database not available, returning empty array");
		return [];
	}
}

// ===========================================
// Blog Post Queries
// ===========================================

export type PostWithAuthor = Post & {
	author?: {
		id: string;
		name: string;
		avatarUrl: string | null;
	} | null;
};

interface GetPostsOptions {
	status?: "borrador" | "publicado";
	category?: string;
	limit?: number;
	offset?: number;
}

/**
 * Get blog posts with optional filters
 */
export async function getPosts(
	options: GetPostsOptions = {},
): Promise<PostWithAuthor[]> {
	const { status = "publicado", category, limit = 10, offset = 0 } = options;

	const conditions = [];

	if (status) {
		conditions.push(eq(posts.status, status));
	}

	if (category) {
		conditions.push(eq(posts.category, category));
	}

	const result = await db.query.posts.findMany({
		where: conditions.length > 0 ? and(...conditions) : undefined,
		with: {
			author: {
				columns: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
		},
		orderBy: [desc(posts.publishedAt)],
		limit,
		offset,
	});

	return result;
}

/**
 * Get recent blog posts
 */
export async function getRecentPosts(limit = 3): Promise<PostWithAuthor[]> {
	return getPosts({ limit });
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(
	slug: string,
): Promise<PostWithAuthor | null> {
	const result = await db.query.posts.findFirst({
		where: and(eq(posts.slug, slug), eq(posts.status, "publicado")),
		with: {
			author: {
				columns: {
					id: true,
					name: true,
					avatarUrl: true,
				},
			},
		},
	});

	return result || null;
}

/**
 * Get all post slugs (for static generation)
 */
export async function getAllPostSlugs(): Promise<string[]> {
	try {
		const result = await db
			.select({ slug: posts.slug })
			.from(posts)
			.where(eq(posts.status, "publicado"));

		return result.map((p) => p.slug);
	} catch {
		// Return empty array if DB is not available (allows build without DB)
		console.warn("getAllPostSlugs: Database not available, returning empty array");
		return [];
	}
}

/**
 * Get unique blog categories
 */
export async function getBlogCategories(): Promise<string[]> {
	const result = await db
		.selectDistinct({ category: posts.category })
		.from(posts)
		.where(eq(posts.status, "publicado"));

	return result
		.filter((r) => r.category !== null)
		.map((r) => r.category as string);
}
