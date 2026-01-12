import { House as HouseIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import { Suspense } from "react";

import { FadeIn, StaggerList } from "@/components/motion";
import { Pagination } from "@/components/property/pagination";
import { AnimatedPropertyCard } from "@/components/property/animated-property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertySort } from "@/components/property/property-sort";
import {
	countPropertiesForSale,
	getPropertiesForSale,
	type SortOption,
} from "@/lib/db/queries";
import type { Property } from "@/lib/db/schema";

// Force dynamic rendering (requires DB at runtime, not build time)
export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 12;

export const metadata: Metadata = {
	title: "Comprar | Propiedades en venta en Parla | Casalia",
	description:
		"Encuentra tu vivienda ideal en Parla. Pisos, casas, locales y mas propiedades en venta. Tu inmobiliaria de confianza.",
};

interface ComprarPageProps {
	searchParams: Promise<{
		tipo?: string;
		precio?: string;
		habitaciones?: string;
		pagina?: string;
		orden?: SortOption;
	}>;
}

function parsePrice(priceRange: string | undefined): {
	min?: number;
	max?: number;
} {
	if (!priceRange) return {};
	const [min, max] = priceRange.split("-");
	return {
		min: min ? Number(min) : undefined,
		max: max ? Number(max) : undefined,
	};
}

export default async function ComprarPage({ searchParams }: ComprarPageProps) {
	const params = await searchParams;

	// Parse filter values from URL
	const propertyType = params.tipo as Property["propertyType"] | undefined;
	const { min: minPrice, max: maxPrice } = parsePrice(params.precio);
	const minBedrooms = params.habitaciones
		? Number(params.habitaciones)
		: undefined;
	const currentPage = Math.max(1, Number(params.pagina) || 1);
	const sortBy = params.orden ?? "destacado";
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	// Fetch properties and total count in parallel
	const [properties, totalCount] = await Promise.all([
		getPropertiesForSale({
			propertyType,
			minPrice,
			maxPrice,
			minBedrooms,
			sortBy,
			limit: ITEMS_PER_PAGE,
			offset,
		}),
		countPropertiesForSale({
			propertyType,
		}),
	]);

	const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

	// Check if filters are active
	const hasFilters = propertyType || minPrice || maxPrice || minBedrooms;

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<section className="bg-[var(--casalia-dark)] text-white py-12">
				<div className="container mx-auto px-4 md:px-6">
					<FadeIn preset="fadeInUp">
						<div className="flex items-center gap-3 mb-4">
							<HouseIcon className="h-8 w-8 text-[var(--casalia-orange)]" />
							<h1 className="text-3xl md:text-4xl font-bold">
								Propiedades en Venta
							</h1>
						</div>
						<p className="text-white/80 max-w-2xl">
							Descubre nuestra seleccion de inmuebles en venta en Parla y
							alrededores. Pisos, casas, locales comerciales y mas.
						</p>
					</FadeIn>
				</div>
			</section>

			{/* Filters & Sort */}
			<section className="border-b border-border bg-card">
				<div className="container mx-auto px-4 md:px-6 py-4">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<Suspense fallback={<div className="h-9" />}>
							<PropertyFilters variant="comprar" />
						</Suspense>
						<div className="flex items-center gap-4">
							<Suspense fallback={<div className="h-9 w-[180px]" />}>
								<PropertySort />
							</Suspense>
							<span className="text-sm text-muted-foreground hidden sm:block">
								{properties.length} propiedad
								{properties.length !== 1 ? "es" : ""}
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Property Grid */}
			<section className="py-12">
				<div className="container mx-auto px-4 md:px-6">
					{properties.length > 0 ? (
						<StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{properties.map((property) => (
								<AnimatedPropertyCard
									key={property.id}
									property={property}
									variant="comprar"
								/>
							))}
						</StaggerList>
					) : (
						<div className="text-center py-16">
							<HouseIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
							<h2 className="text-xl font-semibold mb-2">
								{hasFilters
									? "No hay propiedades con estos filtros"
									: "No hay propiedades disponibles"}
							</h2>
							<p className="text-muted-foreground">
								{hasFilters
									? "Prueba a ajustar los filtros para ver mas resultados."
									: "En este momento no tenemos propiedades en venta. Vuelve pronto o contactanos para que te avisemos cuando haya nuevas ofertas."}
							</p>
						</div>
					)}

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="mt-12">
							<Suspense fallback={<div className="h-9" />}>
								<Pagination currentPage={currentPage} totalPages={totalPages} />
							</Suspense>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
