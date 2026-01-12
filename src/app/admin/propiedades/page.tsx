import {
	PencilSimple as EditIcon,
	Plus as PlusIcon,
	Eye as ViewIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getAdminProperties } from "@/lib/db/admin-queries";

export const metadata: Metadata = {
	title: "Propiedades | Casalia Admin",
	description: "Gestiona las propiedades de Casalia",
};

interface PropiedadesPageProps {
	searchParams: Promise<{
		status?: string;
		tipo?: string;
		pagina?: string;
	}>;
}

export default async function PropiedadesPage({
	searchParams,
}: PropiedadesPageProps) {
	const params = await searchParams;
	const user = await getCurrentUser();

	if (!user) return null;

	const currentPage = Math.max(1, Number(params.pagina) || 1);
	const limit = 20;
	const offset = (currentPage - 1) * limit;

	const { properties, total } = await getAdminProperties({
		status: params.status as
			| "disponible"
			| "reservado"
			| "vendido"
			| "alquilado"
			| undefined,
		operationType: params.tipo as "venta" | "alquiler" | undefined,
		limit,
		offset,
	});

	const totalPages = Math.ceil(total / limit);

	return (
		<>
			<AdminHeader
				title="Propiedades"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6 space-y-6">
				{/* Actions bar */}
				<div className="flex flex-col sm:flex-row gap-4 justify-between">
					<div className="flex gap-2">
						<StatusFilter current={params.status} />
					</div>
					<Link href="/admin/propiedades/nueva">
						<Button className="bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]">
							<PlusIcon className="h-4 w-4 mr-2" />
							Nueva propiedad
						</Button>
					</Link>
				</div>

				{/* Properties table */}
				<Card>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-zinc-50 border-b border-border">
								<tr>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Propiedad
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Precio
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Tipo
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Estado
									</th>
									<th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{properties.length > 0 ? (
									properties.map((property) => (
										<tr key={property.id} className="hover:bg-zinc-50">
											<td className="px-4 py-3">
												<div>
													<p className="font-medium">{property.title}</p>
													<p className="text-sm text-muted-foreground">
														{property.zone || "Sin zona"}
													</p>
												</div>
											</td>
											<td className="px-4 py-3">
												<p className="font-medium">
													{formatPrice(property.price)}
													{property.operationType === "alquiler" && (
														<span className="text-muted-foreground">/mes</span>
													)}
												</p>
											</td>
											<td className="px-4 py-3">
												<Badge variant="secondary" className="capitalize">
													{property.operationType}
												</Badge>
											</td>
											<td className="px-4 py-3">
												<StatusBadge status={property.status} />
											</td>
											<td className="px-4 py-3">
												<div className="flex justify-end gap-2">
													<Link
														href={`/${property.operationType === "venta" ? "comprar" : "alquilar"}/${property.slug}`}
														target="_blank"
													>
														<Button variant="ghost" size="icon">
															<ViewIcon className="h-4 w-4" />
															<span className="sr-only">Ver</span>
														</Button>
													</Link>
													<Link href={`/admin/propiedades/${property.id}`}>
														<Button variant="ghost" size="icon">
															<EditIcon className="h-4 w-4" />
															<span className="sr-only">Editar</span>
														</Button>
													</Link>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={5}
											className="px-4 py-12 text-center text-muted-foreground"
										>
											No hay propiedades
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Mostrando {offset + 1} - {Math.min(offset + limit, total)} de{" "}
								{total}
							</p>
							<div className="flex gap-2">
								{currentPage > 1 && (
									<Link
										href={`/admin/propiedades?pagina=${currentPage - 1}${params.status ? `&status=${params.status}` : ""}`}
									>
										<Button variant="outline" size="sm">
											Anterior
										</Button>
									</Link>
								)}
								{currentPage < totalPages && (
									<Link
										href={`/admin/propiedades?pagina=${currentPage + 1}${params.status ? `&status=${params.status}` : ""}`}
									>
										<Button variant="outline" size="sm">
											Siguiente
										</Button>
									</Link>
								)}
							</div>
						</div>
					)}
				</Card>
			</main>
		</>
	);
}

function StatusFilter({ current }: { current?: string }) {
	const statuses = [
		{ value: undefined, label: "Todos" },
		{ value: "disponible", label: "Disponible" },
		{ value: "reservado", label: "Reservado" },
		{ value: "vendido", label: "Vendido" },
		{ value: "alquilado", label: "Alquilado" },
	];

	return (
		<div className="flex gap-1 p-1 bg-zinc-100 rounded-lg">
			{statuses.map((status) => (
				<Link
					key={status.value ?? "all"}
					href={`/admin/propiedades${status.value ? `?status=${status.value}` : ""}`}
				>
					<Button
						variant="ghost"
						size="sm"
						className={
							current === status.value ||
							(current === undefined && status.value === undefined)
								? "bg-white shadow-sm"
								: ""
						}
					>
						{status.label}
					</Button>
				</Link>
			))}
		</div>
	);
}

function StatusBadge({ status }: { status: string }) {
	const variants: Record<string, string> = {
		disponible: "bg-green-100 text-green-700",
		reservado: "bg-yellow-100 text-yellow-700",
		vendido: "bg-blue-100 text-blue-700",
		alquilado: "bg-purple-100 text-purple-700",
	};

	return (
		<span
			className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${variants[status] || "bg-zinc-100 text-zinc-700"}`}
		>
			{status}
		</span>
	);
}

function formatPrice(price: string | number): string {
	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(numericPrice);
}
