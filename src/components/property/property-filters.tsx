"use client";

import { Funnel as FilterIcon, X as XIcon } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const PROPERTY_TYPES = [
	{ value: "piso", label: "Piso" },
	{ value: "casa", label: "Casa" },
	{ value: "chalet", label: "Chalet" },
	{ value: "atico", label: "Ático" },
	{ value: "duplex", label: "Dúplex" },
	{ value: "estudio", label: "Estudio" },
	{ value: "local", label: "Local" },
	{ value: "oficina", label: "Oficina" },
	{ value: "garaje", label: "Garaje" },
	{ value: "trastero", label: "Trastero" },
	{ value: "terreno", label: "Terreno" },
];

const BEDROOM_OPTIONS = [
	{ value: "1", label: "1+ hab." },
	{ value: "2", label: "2+ hab." },
	{ value: "3", label: "3+ hab." },
	{ value: "4", label: "4+ hab." },
];

const PRICE_RANGES_SALE = [
	{ value: "0-100000", label: "Hasta 100.000€" },
	{ value: "100000-150000", label: "100.000€ - 150.000€" },
	{ value: "150000-200000", label: "150.000€ - 200.000€" },
	{ value: "200000-300000", label: "200.000€ - 300.000€" },
	{ value: "300000-500000", label: "300.000€ - 500.000€" },
	{ value: "500000-", label: "Más de 500.000€" },
];

const PRICE_RANGES_RENT = [
	{ value: "0-500", label: "Hasta 500€/mes" },
	{ value: "500-700", label: "500€ - 700€/mes" },
	{ value: "700-900", label: "700€ - 900€/mes" },
	{ value: "900-1200", label: "900€ - 1.200€/mes" },
	{ value: "1200-1500", label: "1.200€ - 1.500€/mes" },
	{ value: "1500-", label: "Más de 1.500€/mes" },
];

interface PropertyFiltersProps {
	variant: "comprar" | "alquilar";
}

export function PropertyFilters({ variant }: PropertyFiltersProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const priceRanges =
		variant === "comprar" ? PRICE_RANGES_SALE : PRICE_RANGES_RENT;

	// Get current filter values from URL
	const currentType = searchParams.get("tipo") || "";
	const currentBedrooms = searchParams.get("habitaciones") || "";
	const currentPrice = searchParams.get("precio") || "";

	// Check if any filters are active
	const hasActiveFilters = currentType || currentBedrooms || currentPrice;

	// Create query string helper
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			if (value) {
				params.set(name, value);
			} else {
				params.delete(name);
			}
			return params.toString();
		},
		[searchParams],
	);

	// Handle filter change
	const handleFilterChange = (name: string, value: string) => {
		startTransition(() => {
			const queryString = createQueryString(name, value);
			router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
				scroll: false,
			});
		});
	};

	// Clear all filters
	const clearFilters = () => {
		startTransition(() => {
			router.push(pathname, { scroll: false });
		});
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<FilterIcon className="h-4 w-4" />
				<span className="hidden sm:inline">Filtros:</span>
			</div>

			{/* Property Type */}
			<Select
				value={currentType}
				onValueChange={(value) => handleFilterChange("tipo", value)}
			>
				<SelectTrigger className="w-[140px] h-9">
					<SelectValue placeholder="Tipo" />
				</SelectTrigger>
				<SelectContent>
					{PROPERTY_TYPES.map((type) => (
						<SelectItem key={type.value} value={type.value}>
							{type.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Price Range */}
			<Select
				value={currentPrice}
				onValueChange={(value) => handleFilterChange("precio", value)}
			>
				<SelectTrigger className="w-[180px] h-9">
					<SelectValue placeholder="Precio" />
				</SelectTrigger>
				<SelectContent>
					{priceRanges.map((range) => (
						<SelectItem key={range.value} value={range.value}>
							{range.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Bedrooms */}
			<Select
				value={currentBedrooms}
				onValueChange={(value) => handleFilterChange("habitaciones", value)}
			>
				<SelectTrigger className="w-[120px] h-9">
					<SelectValue placeholder="Habitaciones" />
				</SelectTrigger>
				<SelectContent>
					{BEDROOM_OPTIONS.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{/* Clear filters button */}
			{hasActiveFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={clearFilters}
					className="h-9 px-2 text-muted-foreground hover:text-foreground"
					disabled={isPending}
				>
					<XIcon className="h-4 w-4 mr-1" />
					Limpiar
				</Button>
			)}

			{/* Loading indicator */}
			{isPending && (
				<span className="text-xs text-muted-foreground animate-pulse">
					Filtrando...
				</span>
			)}
		</div>
	);
}
