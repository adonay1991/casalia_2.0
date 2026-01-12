"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { type NewProperty, properties, propertyImages } from "@/lib/db/schema";

interface ImageData {
	id?: string;
	url: string;
	order: number;
	isPrimary: boolean;
}

function parseImages(formData: FormData): ImageData[] {
	const imagesJson = formData.get("images") as string;
	if (!imagesJson) return [];

	try {
		return JSON.parse(imagesJson) as ImageData[];
	} catch {
		return [];
	}
}

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.replace(/[^a-z0-9\s-]/g, "") // Remove special chars
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Remove consecutive hyphens
		.trim();
}

export async function createProperty(formData: FormData) {
	try {
		const title = formData.get("title") as string;
		const slug = generateSlug(title);

		// Check if slug exists
		const existingProperty = await db.query.properties.findFirst({
			where: eq(properties.slug, slug),
		});

		const finalSlug = existingProperty ? `${slug}-${Date.now()}` : slug;

		const newProperty: NewProperty = {
			slug: finalSlug,
			title,
			description: formData.get("description") as string,
			price: formData.get("price") as string,
			propertyType: formData.get("propertyType") as NewProperty["propertyType"],
			operationType: formData.get(
				"operationType",
			) as NewProperty["operationType"],
			status: (formData.get("status") as NewProperty["status"]) || "disponible",
			bedrooms: formData.get("bedrooms")
				? Number(formData.get("bedrooms"))
				: null,
			bathrooms: formData.get("bathrooms")
				? Number(formData.get("bathrooms"))
				: null,
			sqmBuilt: formData.get("sqmBuilt")
				? Number(formData.get("sqmBuilt"))
				: null,
			sqmUseful: formData.get("sqmUseful")
				? Number(formData.get("sqmUseful"))
				: null,
			floor: (formData.get("floor") as string) || null,
			yearBuilt: formData.get("yearBuilt")
				? Number(formData.get("yearBuilt"))
				: null,
			energyCertificate:
				(formData.get(
					"energyCertificate",
				) as NewProperty["energyCertificate"]) || null,
			communityFee: formData.get("communityFee")
				? (formData.get("communityFee") as string)
				: null,
			zone: (formData.get("zone") as string) || null,
			address: (formData.get("address") as string) || null,
			hasElevator: formData.get("hasElevator") === "on",
			hasParking: formData.get("hasParking") === "on",
			hasTerrace: formData.get("hasTerrace") === "on",
			hasPool: formData.get("hasPool") === "on",
			hasAirConditioning: formData.get("hasAirConditioning") === "on",
			isHighlighted: formData.get("isHighlighted") === "on",
			syncIdealista: formData.get("syncIdealista") === "on",
			syncFotocasa: formData.get("syncFotocasa") === "on",
			createdBy: formData.get("userId") as string,
			publishedAt: new Date(),
		};

		const [createdProperty] = await db
			.insert(properties)
			.values(newProperty)
			.returning({ id: properties.id });

		// Save images
		const images = parseImages(formData);
		if (images.length > 0 && createdProperty) {
			await db.insert(propertyImages).values(
				images.map((img) => ({
					propertyId: createdProperty.id,
					url: img.url,
					order: img.order,
					isPrimary: img.isPrimary,
				})),
			);
		}

		revalidatePath("/admin/propiedades");
		revalidatePath("/comprar");
		revalidatePath("/alquilar");

		return { success: true };
	} catch (error) {
		console.error("Error creating property:", error);
		return { error: "Error al crear la propiedad" };
	}
}

export async function updateProperty(formData: FormData) {
	try {
		const propertyId = formData.get("propertyId") as string;

		const updates = {
			title: formData.get("title") as string,
			description: formData.get("description") as string,
			price: formData.get("price") as string,
			propertyType: formData.get("propertyType") as NewProperty["propertyType"],
			operationType: formData.get(
				"operationType",
			) as NewProperty["operationType"],
			status: formData.get("status") as NewProperty["status"],
			bedrooms: formData.get("bedrooms")
				? Number(formData.get("bedrooms"))
				: null,
			bathrooms: formData.get("bathrooms")
				? Number(formData.get("bathrooms"))
				: null,
			sqmBuilt: formData.get("sqmBuilt")
				? Number(formData.get("sqmBuilt"))
				: null,
			sqmUseful: formData.get("sqmUseful")
				? Number(formData.get("sqmUseful"))
				: null,
			floor: (formData.get("floor") as string) || null,
			yearBuilt: formData.get("yearBuilt")
				? Number(formData.get("yearBuilt"))
				: null,
			energyCertificate:
				(formData.get(
					"energyCertificate",
				) as NewProperty["energyCertificate"]) || null,
			communityFee: formData.get("communityFee")
				? (formData.get("communityFee") as string)
				: null,
			zone: (formData.get("zone") as string) || null,
			address: (formData.get("address") as string) || null,
			hasElevator: formData.get("hasElevator") === "on",
			hasParking: formData.get("hasParking") === "on",
			hasTerrace: formData.get("hasTerrace") === "on",
			hasPool: formData.get("hasPool") === "on",
			hasAirConditioning: formData.get("hasAirConditioning") === "on",
			isHighlighted: formData.get("isHighlighted") === "on",
			syncIdealista: formData.get("syncIdealista") === "on",
			syncFotocasa: formData.get("syncFotocasa") === "on",
			updatedAt: new Date(),
		};

		await db
			.update(properties)
			.set(updates)
			.where(eq(properties.id, propertyId));

		// Update images: delete all existing and insert new
		const images = parseImages(formData);
		await db
			.delete(propertyImages)
			.where(eq(propertyImages.propertyId, propertyId));

		if (images.length > 0) {
			await db.insert(propertyImages).values(
				images.map((img) => ({
					propertyId,
					url: img.url,
					order: img.order,
					isPrimary: img.isPrimary,
				})),
			);
		}

		revalidatePath("/admin/propiedades");
		revalidatePath("/comprar");
		revalidatePath("/alquilar");

		return { success: true };
	} catch (error) {
		console.error("Error updating property:", error);
		return { error: "Error al actualizar la propiedad" };
	}
}

export async function deleteProperty(propertyId: string) {
	try {
		await db.delete(properties).where(eq(properties.id, propertyId));

		revalidatePath("/admin/propiedades");
		revalidatePath("/comprar");
		revalidatePath("/alquilar");

		return { success: true };
	} catch (error) {
		console.error("Error deleting property:", error);
		return { error: "Error al eliminar la propiedad" };
	}
}
