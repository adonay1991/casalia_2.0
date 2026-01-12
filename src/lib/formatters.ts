/**
 * Centralized formatting utilities for Casalia
 *
 * These functions are pure and easily testable.
 */

/**
 * Format a price in EUR currency
 * @param price - The price as string or number
 * @param operationType - Optional: "alquiler" adds /mes suffix
 * @returns Formatted price string
 */
export function formatPrice(
	price: string | number,
	operationType?: "venta" | "alquiler"
): string {
	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;

	if (Number.isNaN(numericPrice)) {
		return "Precio no disponible";
	}

	const formatted = new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(numericPrice);

	return operationType === "alquiler" ? `${formatted}/mes` : formatted;
}

/**
 * Format a date in Spanish locale
 * @param date - Date object, ISO string, or null
 * @param options - Formatting options
 * @returns Formatted date string
 */
export function formatDate(
	date: Date | string | null,
	options?: {
		includeTime?: boolean;
		style?: "short" | "long" | "medium";
	}
): string {
	if (!date) return "";

	const d = typeof date === "string" ? new Date(date) : date;

	if (Number.isNaN(d.getTime())) {
		return "";
	}

	const { includeTime = false, style = "long" } = options ?? {};

	const dateOptions: Intl.DateTimeFormatOptions =
		style === "short"
			? { day: "2-digit", month: "2-digit", year: "numeric" }
			: style === "medium"
				? { day: "numeric", month: "short", year: "numeric" }
				: { day: "numeric", month: "long", year: "numeric" };

	if (includeTime) {
		dateOptions.hour = "2-digit";
		dateOptions.minute = "2-digit";
	}

	return new Intl.DateTimeFormat("es-ES", dateOptions).format(d);
}

/**
 * Get the color class for energy certificate rating
 * @param cert - Energy certificate letter (A-G) or special values
 * @returns Tailwind background color class
 */
export function getEnergyCertificateColor(cert: string): string {
	const colors: Record<string, string> = {
		A: "bg-green-500",
		B: "bg-green-400",
		C: "bg-lime-400",
		D: "bg-yellow-400",
		E: "bg-orange-400",
		F: "bg-orange-500",
		G: "bg-red-500",
		en_tramite: "bg-gray-400",
		exento: "bg-gray-400",
	};
	return colors[cert] ?? "bg-gray-400";
}

/**
 * Get Spanish label for property type
 * @param type - Property type enum value
 * @returns Spanish label
 */
export function getPropertyTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		piso: "Piso",
		casa: "Casa",
		terreno: "Terreno",
		local: "Local",
		garaje: "Garaje",
		trastero: "Trastero",
	};
	return labels[type] ?? type;
}

/**
 * Get Spanish label for operation type
 * @param type - Operation type enum value
 * @returns Spanish label
 */
export function getOperationTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		venta: "Venta",
		alquiler: "Alquiler",
	};
	return labels[type] ?? type;
}

/**
 * Get Spanish label for property status
 * @param status - Property status enum value
 * @returns Spanish label
 */
export function getPropertyStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		disponible: "Disponible",
		reservado: "Reservado",
		vendido: "Vendido",
		alquilado: "Alquilado",
	};
	return labels[status] ?? status;
}

/**
 * Get badge variant for property status
 * @param status - Property status enum value
 * @returns Badge variant for shadcn/ui
 */
export function getPropertyStatusBadgeVariant(
	status: string
): "default" | "secondary" | "destructive" | "outline" | null {
	switch (status) {
		case "disponible":
			return null; // No badge for available
		case "reservado":
			return "secondary";
		case "vendido":
		case "alquilado":
			return "destructive";
		default:
			return null;
	}
}

/**
 * Get Spanish label for lead status
 * @param status - Lead status enum value
 * @returns Spanish label
 */
export function getLeadStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		nuevo: "Nuevo",
		contactado: "Contactado",
		visita: "Visita Programada",
		cerrado: "Cerrado",
		descartado: "Descartado",
	};
	return labels[status] ?? status;
}

/**
 * Get Spanish label for lead source
 * @param source - Lead source enum value
 * @returns Spanish label
 */
export function getLeadSourceLabel(source: string): string {
	const labels: Record<string, string> = {
		web: "Web",
		idealista: "Idealista",
		fotocasa: "Fotocasa",
		whatsapp: "WhatsApp",
		telefono: "Telefono",
		presencial: "Presencial",
		valoracion: "Valoracion",
	};
	return labels[source] ?? source;
}

/**
 * Generate slug from title
 * @param title - The title to slugify
 * @returns URL-safe slug
 */
export function slugify(title: string): string {
	return title
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.replace(/[^a-z0-9\s-]/g, "") // Remove special chars
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Replace multiple hyphens
		.replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Truncate text to a maximum length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength - 3)}...`;
}

/**
 * Format square meters with unit
 * @param sqm - Square meters value
 * @returns Formatted string with unit
 */
export function formatSquareMeters(sqm: number | null | undefined): string {
	if (sqm === null || sqm === undefined) return "";
	return `${sqm} m²`;
}

/**
 * Format phone number for display
 * @param phone - Phone number string
 * @returns Formatted phone number
 */
export function formatPhone(phone: string): string {
	// Remove non-digits
	const digits = phone.replace(/\D/g, "");

	// Spanish mobile format: XXX XXX XXX
	if (digits.length === 9) {
		return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
	}

	// With country code: +34 XXX XXX XXX
	if (digits.length === 11 && digits.startsWith("34")) {
		return `+34 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
	}

	return phone;
}
