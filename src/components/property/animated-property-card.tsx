"use client";

import { StaggerItem } from "@/components/motion";
import { PropertyCard } from "./property-card";
import type { Property, PropertyImage } from "@/lib/db/schema";

interface AnimatedPropertyCardProps {
	property: Property & {
		images?: PropertyImage[];
	};
	variant?: "default" | "comprar" | "alquilar";
}

/**
 * Wrapper animado para PropertyCard.
 * Usa StaggerItem para animacion escalonada cuando se usa dentro de StaggerList.
 */
export function AnimatedPropertyCard({
	property,
	variant = "default",
}: AnimatedPropertyCardProps) {
	return (
		<StaggerItem>
			<PropertyCard property={property} variant={variant} />
		</StaggerItem>
	);
}
