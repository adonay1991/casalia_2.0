import {
	Bathtub as BathtubIcon,
	Bed as BedIcon,
	MapPin as MapPinIcon,
	Ruler as RulerIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Property, PropertyImage } from "@/lib/db/schema";

interface PropertyCardProps {
	property: Property & {
		images?: PropertyImage[];
	};
	/**
	 * Variant affects the link destination
	 * - "default": links to /comprar or /alquilar based on operationType
	 * - "comprar": always links to /comprar
	 * - "alquilar": always links to /alquilar
	 */
	variant?: "default" | "comprar" | "alquilar";
}

function formatPrice(price: string | number, operationType: string): string {
	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;
	const formatted = new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(numericPrice);

	return operationType === "alquiler" ? `${formatted}/mes` : formatted;
}

function getStatusBadge(status: string): {
	label: string;
	variant: "default" | "secondary" | "destructive" | "outline";
} | null {
	switch (status) {
		case "disponible":
			return null; // No badge for available
		case "reservado":
			return { label: "Reservado", variant: "secondary" };
		case "vendido":
			return { label: "Vendido", variant: "destructive" };
		case "alquilado":
			return { label: "Alquilado", variant: "destructive" };
		default:
			return null;
	}
}

function getPropertyTypeLabel(type: string): string {
	const labels: Record<string, string> = {
		piso: "Piso",
		casa: "Casa",
		terreno: "Terreno",
		local: "Local",
		garaje: "Garaje",
		trastero: "Trastero",
	};
	return labels[type] || type;
}

export function PropertyCard({
	property,
	variant = "default",
}: PropertyCardProps) {
	const primaryImage =
		property.images?.find((img) => img.isPrimary) || property.images?.[0];
	const statusBadge = getStatusBadge(property.status);

	// Determine link path
	let basePath: string;
	if (variant === "default") {
		basePath = property.operationType === "alquiler" ? "/alquilar" : "/comprar";
	} else {
		basePath = `/${variant}`;
	}
	const href = `${basePath}/${property.slug}`;

	const showRoomInfo =
		property.propertyType === "piso" || property.propertyType === "casa";

	return (
		<article className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-lg transition-all duration-300">
			{/* Property Image */}
			<Link
				href={href}
				className="block relative h-48 bg-zinc-200 overflow-hidden"
			>
				{primaryImage ? (
					<Image
						src={primaryImage.url}
						alt={property.title}
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-300"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				) : (
					<div className="absolute inset-0 flex items-center justify-center text-zinc-400">
						Sin imagen
					</div>
				)}

				{/* Badges */}
				<div className="absolute top-3 left-3 flex gap-2">
					{property.isHighlighted && (
						<Badge className="bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange)]">
							Destacado
						</Badge>
					)}
					{statusBadge && (
						<Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
					)}
				</div>

				{/* Property Type Badge */}
				<div className="absolute bottom-3 left-3">
					<Badge variant="outline" className="bg-white/90 text-zinc-700">
						{getPropertyTypeLabel(property.propertyType)}
					</Badge>
				</div>

				{/* Operation Type Badge */}
				<div className="absolute bottom-3 right-3">
					<Badge
						variant="outline"
						className={
							property.operationType === "alquiler"
								? "bg-blue-500/90 text-white border-blue-500"
								: "bg-green-500/90 text-white border-green-500"
						}
					>
						{property.operationType === "alquiler" ? "Alquiler" : "Venta"}
					</Badge>
				</div>
			</Link>

			{/* Property Details */}
			<div className="p-4">
				{/* Zone */}
				{property.zone && (
					<div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
						<MapPinIcon className="h-3.5 w-3.5" />
						<span>{property.zone}</span>
					</div>
				)}

				{/* Title */}
				<Link href={href}>
					<h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-[var(--casalia-orange)] transition-colors">
						{property.title}
					</h3>
				</Link>

				{/* Price */}
				<p className="text-2xl font-bold text-[var(--casalia-orange)] mb-4">
					{formatPrice(property.price, property.operationType)}
				</p>

				{/* Features */}
				<div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
					{showRoomInfo && property.bedrooms !== null && (
						<span className="flex items-center gap-1">
							<BedIcon className="h-4 w-4" />
							{property.bedrooms} Hab.
						</span>
					)}
					{showRoomInfo && property.bathrooms !== null && (
						<span className="flex items-center gap-1">
							<BathtubIcon className="h-4 w-4" />
							{property.bathrooms} Baño{property.bathrooms !== 1 ? "s" : ""}
						</span>
					)}
					{property.sqmBuilt && (
						<span className="flex items-center gap-1">
							<RulerIcon className="h-4 w-4" />
							{property.sqmBuilt} m²
						</span>
					)}
				</div>

				{/* CTA Button */}
				<Link
					href={href}
					className="block w-full text-center py-2.5 px-4 bg-[var(--casalia-dark)] text-white rounded-md hover:bg-zinc-700 transition-colors font-medium"
				>
					Ver detalles
				</Link>
			</div>
		</article>
	);
}
