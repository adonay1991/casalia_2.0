/**
 * Portal Integration Service
 *
 * Handles synchronization with real estate portals:
 * - Idealista
 * - Fotocasa
 *
 * SETUP:
 * 1. Contact Idealista/Fotocasa for API credentials
 * 2. Add API keys to .env.local:
 *    - IDEALISTA_API_KEY
 *    - IDEALISTA_API_SECRET
 *    - FOTOCASA_API_KEY
 *    - FOTOCASA_API_SECRET
 * 3. Enable sync in admin panel per property
 */

import type { InferSelectModel } from "drizzle-orm";
import type { properties, propertyImages } from "@/lib/db/schema";

type Property = InferSelectModel<typeof properties>;
type PropertyImage = InferSelectModel<typeof propertyImages>;

export interface PortalProperty {
	// Common fields across portals
	reference: string;
	title: string;
	description: string;
	price: number;
	propertyType: string;
	operationType: "sale" | "rent";
	address: {
		street?: string;
		city: string;
		province: string;
		postalCode?: string;
		latitude?: number;
		longitude?: number;
	};
	features: {
		bedrooms?: number;
		bathrooms?: number;
		sqmBuilt?: number;
		sqmUseful?: number;
		floor?: string;
		hasElevator?: boolean;
		hasParking?: boolean;
		hasTerrace?: boolean;
		hasPool?: boolean;
		hasAirConditioning?: boolean;
		yearBuilt?: number;
		energyCertificate?: string;
	};
	images: Array<{
		url: string;
		caption?: string;
	}>;
}

export interface SyncResult {
	success: boolean;
	portalId?: string;
	error?: string;
}

/**
 * Transform Casalia property to portal format
 */
export function transformToPortalFormat(
	property: Property,
	images: PropertyImage[]
): PortalProperty {
	return {
		reference: property.slug,
		title: property.title,
		description: property.description,
		price: Number(property.price),
		propertyType: property.propertyType,
		operationType: property.operationType === "venta" ? "sale" : "rent",
		address: {
			street: property.address ?? undefined,
			city: property.zone ?? "Parla",
			province: "Madrid",
			latitude: property.lat ? Number(property.lat) : undefined,
			longitude: property.lng ? Number(property.lng) : undefined,
		},
		features: {
			bedrooms: property.bedrooms ?? undefined,
			bathrooms: property.bathrooms ?? undefined,
			sqmBuilt: property.sqmBuilt ?? undefined,
			sqmUseful: property.sqmUseful ?? undefined,
			floor: property.floor ?? undefined,
			hasElevator: property.hasElevator ?? undefined,
			hasParking: property.hasParking ?? undefined,
			hasTerrace: property.hasTerrace ?? undefined,
			hasPool: property.hasPool ?? undefined,
			hasAirConditioning: property.hasAirConditioning ?? undefined,
			yearBuilt: property.yearBuilt ?? undefined,
			energyCertificate: property.energyCertificate ?? undefined,
		},
		images: images
			.sort((a, b) => a.order - b.order)
			.map((img) => ({
				url: img.url,
			})),
	};
}

/**
 * Idealista Portal Client
 *
 * Documentation: https://developers.idealista.com
 */
export const idealistaClient = {
	isConfigured(): boolean {
		return Boolean(
			process.env.IDEALISTA_API_KEY && process.env.IDEALISTA_API_SECRET
		);
	},

	async publish(property: PortalProperty): Promise<SyncResult> {
		if (!this.isConfigured()) {
			return {
				success: false,
				error: "Idealista API not configured",
			};
		}

		// TODO: Implement actual API call when credentials are available
		// const response = await fetch("https://api.idealista.com/...", {
		//   method: "POST",
		//   headers: {
		//     "Authorization": `Bearer ${process.env.IDEALISTA_API_KEY}`,
		//     "Content-Type": "application/json",
		//   },
		//   body: JSON.stringify(property),
		// });

		console.log("[Idealista] Would publish property:", property.reference);
		return { success: false, error: "API not implemented" };
	},

	async update(portalId: string, property: PortalProperty): Promise<SyncResult> {
		if (!this.isConfigured()) {
			return {
				success: false,
				error: "Idealista API not configured",
			};
		}

		console.log("[Idealista] Would update property:", portalId);
		return { success: false, error: "API not implemented" };
	},

	async unpublish(portalId: string): Promise<SyncResult> {
		if (!this.isConfigured()) {
			return {
				success: false,
				error: "Idealista API not configured",
			};
		}

		console.log("[Idealista] Would unpublish property:", portalId);
		return { success: false, error: "API not implemented" };
	},
};

/**
 * Fotocasa Portal Client
 *
 * Documentation: Contact Fotocasa for API access
 */
export const fotocasaClient = {
	isConfigured(): boolean {
		return Boolean(
			process.env.FOTOCASA_API_KEY && process.env.FOTOCASA_API_SECRET
		);
	},

	async publish(property: PortalProperty): Promise<SyncResult> {
		if (!this.isConfigured()) {
			return {
				success: false,
				error: "Fotocasa API not configured",
			};
		}

		console.log("[Fotocasa] Would publish property:", property.reference);
		return { success: false, error: "API not implemented" };
	},

	async update(portalId: string, property: PortalProperty): Promise<SyncResult> {
		if (!this.isConfigured()) {
			return {
				success: false,
				error: "Fotocasa API not configured",
			};
		}

		console.log("[Fotocasa] Would update property:", portalId);
		return { success: false, error: "API not implemented" };
	},

	async unpublish(portalId: string): Promise<SyncResult> {
		if (!this.isConfigured()) {
			return {
				success: false,
				error: "Fotocasa API not configured",
			};
		}

		console.log("[Fotocasa] Would unpublish property:", portalId);
		return { success: false, error: "API not implemented" };
	},
};

/**
 * Sync a property to all enabled portals
 */
export async function syncPropertyToPortals(
	property: Property,
	images: PropertyImage[]
): Promise<{
	idealista?: SyncResult;
	fotocasa?: SyncResult;
}> {
	const portalProperty = transformToPortalFormat(property, images);
	const results: { idealista?: SyncResult; fotocasa?: SyncResult } = {};

	if (property.syncIdealista) {
		if (property.idealistaId) {
			results.idealista = await idealistaClient.update(
				property.idealistaId,
				portalProperty
			);
		} else {
			results.idealista = await idealistaClient.publish(portalProperty);
		}
	}

	if (property.syncFotocasa) {
		if (property.fotocasaId) {
			results.fotocasa = await fotocasaClient.update(
				property.fotocasaId,
				portalProperty
			);
		} else {
			results.fotocasa = await fotocasaClient.publish(portalProperty);
		}
	}

	return results;
}
