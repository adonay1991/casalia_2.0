/**
 * Admin Dashboard Queries
 *
 * Database queries for the admin panel.
 */

import { and, count, desc, eq, gte } from "drizzle-orm";

import { db } from "./index";
import { type Lead, leads, type Property, posts, properties } from "./schema";

// ===========================================
// Dashboard Stats
// ===========================================

interface DashboardStats {
	totalProperties: number;
	availableProperties: number;
	soldProperties: number;
	propertiesThisMonth: number;
	totalLeads: number;
	leadsThisMonth: number;
	totalPosts: number;
	publishedPosts: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
	try {
		const now = new Date();
		const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

		// Run all queries in parallel
		const [
			totalPropertiesResult,
			availablePropertiesResult,
			soldPropertiesResult,
			propertiesThisMonthResult,
			totalLeadsResult,
			leadsThisMonthResult,
			totalPostsResult,
			publishedPostsResult,
		] = await Promise.all([
			db.select({ value: count() }).from(properties),
			db
				.select({ value: count() })
				.from(properties)
				.where(eq(properties.status, "disponible")),
			db
				.select({ value: count() })
				.from(properties)
				.where(eq(properties.status, "vendido")),
			db
				.select({ value: count() })
				.from(properties)
				.where(gte(properties.createdAt, firstDayOfMonth)),
			db.select({ value: count() }).from(leads),
			db
				.select({ value: count() })
				.from(leads)
				.where(gte(leads.createdAt, firstDayOfMonth)),
			db.select({ value: count() }).from(posts),
			db
				.select({ value: count() })
				.from(posts)
				.where(eq(posts.status, "publicado")),
		]);

		return {
			totalProperties: totalPropertiesResult[0]?.value ?? 0,
			availableProperties: availablePropertiesResult[0]?.value ?? 0,
			soldProperties: soldPropertiesResult[0]?.value ?? 0,
			propertiesThisMonth: propertiesThisMonthResult[0]?.value ?? 0,
			totalLeads: totalLeadsResult[0]?.value ?? 0,
			leadsThisMonth: leadsThisMonthResult[0]?.value ?? 0,
			totalPosts: totalPostsResult[0]?.value ?? 0,
			publishedPosts: publishedPostsResult[0]?.value ?? 0,
		};
	} catch {
		console.warn("getDashboardStats: Database not available");
		return {
			totalProperties: 0,
			availableProperties: 0,
			soldProperties: 0,
			propertiesThisMonth: 0,
			totalLeads: 0,
			leadsThisMonth: 0,
			totalPosts: 0,
			publishedPosts: 0,
		};
	}
}

// ===========================================
// Recent Leads
// ===========================================

export async function getRecentLeads(limit = 5): Promise<Lead[]> {
	try {
		return await db.query.leads.findMany({
			orderBy: [desc(leads.createdAt)],
			limit,
		});
	} catch {
		console.warn("getRecentLeads: Database not available");
		return [];
	}
}

// ===========================================
// Top Properties
// ===========================================

export async function getTopProperties(limit = 5): Promise<Property[]> {
	try {
		return await db.query.properties.findMany({
			orderBy: [desc(properties.isHighlighted), desc(properties.createdAt)],
			limit,
		});
	} catch {
		console.warn("getTopProperties: Database not available");
		return [];
	}
}

// ===========================================
// Properties List (Admin)
// ===========================================

interface GetAdminPropertiesOptions {
	status?: Property["status"];
	operationType?: Property["operationType"];
	search?: string;
	limit?: number;
	offset?: number;
}

export async function getAdminProperties(
	options: GetAdminPropertiesOptions = {},
): Promise<{ properties: Property[]; total: number }> {
	try {
		const { status, operationType, limit = 20, offset = 0 } = options;

		const conditions = [];

		if (status) {
			conditions.push(eq(properties.status, status));
		}

		if (operationType) {
			conditions.push(eq(properties.operationType, operationType));
		}

		const [propertiesList, totalResult] = await Promise.all([
			db.query.properties.findMany({
				where: conditions.length > 0 ? and(...conditions) : undefined,
				orderBy: [desc(properties.createdAt)],
				limit,
				offset,
			}),
			db
				.select({ value: count() })
				.from(properties)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		return {
			properties: propertiesList,
			total: totalResult[0]?.value ?? 0,
		};
	} catch {
		console.warn("getAdminProperties: Database not available");
		return { properties: [], total: 0 };
	}
}

// ===========================================
// Leads List (Admin)
// ===========================================

interface GetAdminLeadsOptions {
	status?: Lead["status"];
	limit?: number;
	offset?: number;
}

interface LeadWithProperty extends Lead {
	property: {
		id: string;
		title: string;
		slug: string;
	} | null;
}

export async function getAdminLeads(
	options: GetAdminLeadsOptions = {},
): Promise<{ leads: LeadWithProperty[]; total: number }> {
	try {
		const { status, limit = 20, offset = 0 } = options;

		const conditions = [];

		if (status) {
			conditions.push(eq(leads.status, status));
		}

		const [leadsList, totalResult] = await Promise.all([
			db.query.leads.findMany({
				where: conditions.length > 0 ? and(...conditions) : undefined,
				with: {
					property: {
						columns: {
							id: true,
							title: true,
							slug: true,
						},
					},
				},
				orderBy: [desc(leads.createdAt)],
				limit,
				offset,
			}),
			db
				.select({ value: count() })
				.from(leads)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		return {
			leads: leadsList as LeadWithProperty[],
			total: totalResult[0]?.value ?? 0,
		};
	} catch {
		console.warn("getAdminLeads: Database not available");
		return { leads: [], total: 0 };
	}
}

// ===========================================
// Posts List (Admin)
// ===========================================

interface GetAdminPostsOptions {
	status?: "borrador" | "publicado";
	limit?: number;
	offset?: number;
}

export async function getAdminPosts(
	options: GetAdminPostsOptions = {},
): Promise<{
	posts: Array<{
		id: string;
		slug: string;
		title: string;
		status: string;
		publishedAt: Date | null;
		createdAt: Date;
	}>;
	total: number;
}> {
	try {
		const { status, limit = 20, offset = 0 } = options;

		const conditions = [];

		if (status) {
			conditions.push(eq(posts.status, status));
		}

		const [postsList, totalResult] = await Promise.all([
			db.query.posts.findMany({
				columns: {
					id: true,
					slug: true,
					title: true,
					status: true,
					publishedAt: true,
					createdAt: true,
				},
				where: conditions.length > 0 ? and(...conditions) : undefined,
				orderBy: [desc(posts.createdAt)],
				limit,
				offset,
			}),
			db
				.select({ value: count() })
				.from(posts)
				.where(conditions.length > 0 ? and(...conditions) : undefined),
		]);

		return {
			posts: postsList,
			total: totalResult[0]?.value ?? 0,
		};
	} catch {
		console.warn("getAdminPosts: Database not available");
		return { posts: [], total: 0 };
	}
}

// ===========================================
// Chart Data Queries
// ===========================================

export interface PropertyStatusData {
	status: string;
	count: number;
	label: string;
}

const STATUS_LABELS: Record<string, string> = {
	disponible: "Disponible",
	reservado: "Reservado",
	vendido: "Vendido",
	alquilado: "Alquilado",
};

export async function getPropertiesByStatus(): Promise<PropertyStatusData[]> {
	try {
		const result = await db
			.select({
				status: properties.status,
				count: count(),
			})
			.from(properties)
			.groupBy(properties.status);

		return result.map((row) => ({
			status: row.status,
			count: row.count,
			label: STATUS_LABELS[row.status] ?? row.status,
		}));
	} catch {
		console.warn("getPropertiesByStatus: Database not available");
		return [];
	}
}

export interface LeadTrendData {
	date: string;
	count: number;
}

export async function getLeadsTrend(days = 7): Promise<LeadTrendData[]> {
	try {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		startDate.setHours(0, 0, 0, 0);

		// Get all leads in the date range
		const leadsInRange = await db.query.leads.findMany({
			columns: {
				createdAt: true,
			},
			where: gte(leads.createdAt, startDate),
		});

		// Group by date
		const countsByDate = new Map<string, number>();

		// Initialize all dates with 0
		for (let i = 0; i <= days; i++) {
			const date = new Date();
			date.setDate(date.getDate() - (days - i));
			const dateStr = date.toISOString().split("T")[0];
			if (dateStr) {
				countsByDate.set(dateStr, 0);
			}
		}

		// Count leads per date
		for (const lead of leadsInRange) {
			const dateStr = lead.createdAt.toISOString().split("T")[0];
			if (dateStr) {
				const current = countsByDate.get(dateStr) ?? 0;
				countsByDate.set(dateStr, current + 1);
			}
		}

		// Convert to array and sort by date
		return Array.from(countsByDate.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([date, count]) => ({
				date,
				count,
			}));
	} catch {
		console.warn("getLeadsTrend: Database not available");
		// Return empty data for the last N days
		const result: LeadTrendData[] = [];
		for (let i = 0; i <= days; i++) {
			const date = new Date();
			date.setDate(date.getDate() - (days - i));
			const dateStr = date.toISOString().split("T")[0];
			if (dateStr) {
				result.push({ date: dateStr, count: 0 });
			}
		}
		return result;
	}
}
