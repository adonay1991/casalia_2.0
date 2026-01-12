/**
 * Schema.org JSON-LD Components for SEO
 *
 * These components add structured data that search engines use
 * to create rich snippets in search results.
 */

import type { InferSelectModel } from "drizzle-orm";
import type { properties, propertyImages, posts } from "@/lib/db/schema";

type Property = InferSelectModel<typeof properties>;
type PropertyImage = InferSelectModel<typeof propertyImages>;
type Post = InferSelectModel<typeof posts>;

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casalia.org";

/**
 * Organization Schema - Represents the real estate business
 */
export function OrganizationSchema() {
	const organizationData = {
		"@context": "https://schema.org",
		"@type": "RealEstateAgent",
		name: "Casalia Inmobiliaria",
		description:
			"Tu inmobiliaria de confianza en Parla. Compra, venta y alquiler de pisos, casas y locales.",
		url: BASE_URL,
		logo: `${BASE_URL}/logo.png`,
		image: `${BASE_URL}/og-image.jpg`,
		telephone: "+34912345678",
		email: "info@casalia.org",
		address: {
			"@type": "PostalAddress",
			streetAddress: "Calle Principal, 1",
			addressLocality: "Parla",
			addressRegion: "Madrid",
			postalCode: "28980",
			addressCountry: "ES",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: 40.2381,
			longitude: -3.7676,
		},
		areaServed: {
			"@type": "City",
			name: "Parla",
		},
		sameAs: [
			"https://www.facebook.com/casaliainmobiliaria",
			"https://www.instagram.com/casalia_inmobiliaria",
		],
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "09:30",
				closes: "13:30",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "17:00",
				closes: "20:00",
			},
		],
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
		/>
	);
}

/**
 * WebSite Schema - Enables sitelinks search box in Google
 */
export function WebSiteSchema() {
	const websiteData = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Casalia Inmobiliaria",
		url: BASE_URL,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${BASE_URL}/comprar?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
		/>
	);
}

/**
 * Maps property type to Schema.org type
 */
function getSchemaPropertyType(
	propertyType: string
): string {
	const typeMap: Record<string, string> = {
		piso: "Apartment",
		casa: "House",
		terreno: "LandPlot",
		local: "Store",
		garaje: "ParkingFacility",
		trastero: "StorageRoom",
	};
	return typeMap[propertyType] ?? "RealEstateListing";
}

/**
 * RealEstateListing Schema - For individual property pages
 */
export function PropertySchema({
	property,
	images,
}: {
	property: Property;
	images: PropertyImage[];
}) {
	const operationType = property.operationType === "venta" ? "sale" : "rent";
	const url =
		operationType === "sale"
			? `${BASE_URL}/comprar/${property.slug}`
			: `${BASE_URL}/alquilar/${property.slug}`;

	const propertyData = {
		"@context": "https://schema.org",
		"@type": "RealEstateListing",
		name: property.title,
		description: property.description,
		url,
		image: images.map((img) => img.url),
		datePosted: property.publishedAt
			? new Date(property.publishedAt).toISOString()
			: new Date(property.createdAt).toISOString(),
		offers: {
			"@type": "Offer",
			price: Number(property.price),
			priceCurrency: "EUR",
			availability: property.status === "disponible"
				? "https://schema.org/InStock"
				: "https://schema.org/SoldOut",
			priceValidUntil: new Date(
				Date.now() + 30 * 24 * 60 * 60 * 1000
			).toISOString(),
			businessFunction:
				operationType === "sale"
					? "https://schema.org/SellAction"
					: "https://schema.org/LeaseAction",
		},
		// Property details using additionalType for specificity
		additionalType: `https://schema.org/${getSchemaPropertyType(property.propertyType)}`,
		// Location
		address: {
			"@type": "PostalAddress",
			streetAddress: property.address ?? undefined,
			addressLocality: property.zone ?? "Parla",
			addressRegion: "Madrid",
			addressCountry: "ES",
		},
		...(property.lat && property.lng
			? {
					geo: {
						"@type": "GeoCoordinates",
						latitude: Number(property.lat),
						longitude: Number(property.lng),
					},
				}
			: {}),
		// Property features
		...(property.sqmBuilt
			? {
					floorSize: {
						"@type": "QuantitativeValue",
						value: property.sqmBuilt,
						unitCode: "MTK",
					},
				}
			: {}),
		...(property.bedrooms
			? {
					numberOfRooms: property.bedrooms,
				}
			: {}),
		...(property.bathrooms
			? {
					numberOfBathroomsTotal: property.bathrooms,
				}
			: {}),
		...(property.yearBuilt
			? {
					yearBuilt: property.yearBuilt,
				}
			: {}),
		// Amenities as additionalProperty
		additionalProperty: [
			...(property.hasElevator
				? [
						{
							"@type": "PropertyValue",
							name: "Ascensor",
							value: "Si",
						},
					]
				: []),
			...(property.hasParking
				? [
						{
							"@type": "PropertyValue",
							name: "Parking",
							value: "Si",
						},
					]
				: []),
			...(property.hasTerrace
				? [
						{
							"@type": "PropertyValue",
							name: "Terraza",
							value: "Si",
						},
					]
				: []),
			...(property.hasPool
				? [
						{
							"@type": "PropertyValue",
							name: "Piscina",
							value: "Si",
						},
					]
				: []),
			...(property.hasAirConditioning
				? [
						{
							"@type": "PropertyValue",
							name: "Aire acondicionado",
							value: "Si",
						},
					]
				: []),
			...(property.floor
				? [
						{
							"@type": "PropertyValue",
							name: "Planta",
							value: property.floor,
						},
					]
				: []),
			...(property.energyCertificate
				? [
						{
							"@type": "PropertyValue",
							name: "Certificado energetico",
							value: property.energyCertificate.toUpperCase(),
						},
					]
				: []),
		],
		// Seller info
		seller: {
			"@type": "RealEstateAgent",
			name: "Casalia Inmobiliaria",
			url: BASE_URL,
		},
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyData) }}
		/>
	);
}

/**
 * BreadcrumbList Schema - For navigation
 */
export function BreadcrumbSchema({
	items,
}: {
	items: Array<{ name: string; url: string }>;
}) {
	const breadcrumbData = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url,
		})),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
		/>
	);
}

/**
 * BlogPosting Schema - For blog articles
 */
export function BlogPostSchema({ post }: { post: Post }) {
	const blogPostData = {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.excerpt ?? post.title,
		url: `${BASE_URL}/blog/${post.slug}`,
		...(post.featuredImage
			? {
					image: post.featuredImage,
				}
			: {}),
		datePublished: post.publishedAt
			? new Date(post.publishedAt).toISOString()
			: new Date(post.createdAt).toISOString(),
		dateModified: new Date(post.updatedAt).toISOString(),
		author: {
			"@type": "Organization",
			name: "Casalia Inmobiliaria",
			url: BASE_URL,
		},
		publisher: {
			"@type": "Organization",
			name: "Casalia Inmobiliaria",
			url: BASE_URL,
			logo: {
				"@type": "ImageObject",
				url: `${BASE_URL}/logo.png`,
			},
		},
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${BASE_URL}/blog/${post.slug}`,
		},
		...(post.category
			? {
					articleSection: post.category,
				}
			: {}),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostData) }}
		/>
	);
}

/**
 * ItemList Schema - For property listing pages
 */
export function PropertyListSchema({
	properties,
	operationType,
}: {
	properties: Array<Property & { images: PropertyImage[] }>;
	operationType: "venta" | "alquiler";
}) {
	const basePath = operationType === "venta" ? "comprar" : "alquilar";

	const listData = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name:
			operationType === "venta"
				? "Propiedades en venta en Parla"
				: "Propiedades en alquiler en Parla",
		numberOfItems: properties.length,
		itemListElement: properties.slice(0, 10).map((property, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: `${BASE_URL}/${basePath}/${property.slug}`,
			name: property.title,
		})),
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe for JSON-LD
			dangerouslySetInnerHTML={{ __html: JSON.stringify(listData) }}
		/>
	);
}
