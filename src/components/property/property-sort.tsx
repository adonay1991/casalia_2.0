"use client";

import { SortAscending as SortIcon } from "@phosphor-icons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
	{ value: "destacado", label: "Destacados" },
	{ value: "reciente", label: "Mas recientes" },
	{ value: "precio-asc", label: "Precio: menor a mayor" },
	{ value: "precio-desc", label: "Precio: mayor a menor" },
	{ value: "superficie-desc", label: "Mayor superficie" },
];

export function PropertySort() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const currentSort = searchParams.get("orden") || "destacado";

	const handleSortChange = useCallback(
		(value: string) => {
			startTransition(() => {
				const params = new URLSearchParams(searchParams.toString());
				if (value === "destacado") {
					params.delete("orden");
				} else {
					params.set("orden", value);
				}
				// Reset pagination when sorting changes
				params.delete("pagina");
				const queryString = params.toString();
				router.push(`${pathname}${queryString ? `?${queryString}` : ""}`, {
					scroll: false,
				});
			});
		},
		[pathname, router, searchParams],
	);

	return (
		<div className="flex items-center gap-2">
			<SortIcon className="h-4 w-4 text-muted-foreground hidden sm:block" />
			<Select value={currentSort} onValueChange={handleSortChange}>
				<SelectTrigger className="w-[180px] h-9" disabled={isPending}>
					<SelectValue placeholder="Ordenar por" />
				</SelectTrigger>
				<SelectContent>
					{SORT_OPTIONS.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
