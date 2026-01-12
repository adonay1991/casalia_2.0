import {
	EnvelopeSimple as EmailIcon,
	Phone as PhoneIcon,
	Eye as ViewIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getAdminLeads } from "@/lib/db/admin-queries";

export const metadata: Metadata = {
	title: "Leads | Casalia Admin",
	description: "Gestiona los leads de Casalia",
};

interface LeadsPageProps {
	searchParams: Promise<{
		status?: string;
		pagina?: string;
	}>;
}

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
	const params = await searchParams;
	const user = await getCurrentUser();

	if (!user) return null;

	const currentPage = Math.max(1, Number(params.pagina) || 1);
	const limit = 20;
	const offset = (currentPage - 1) * limit;

	const { leads, total } = await getAdminLeads({
		status: params.status as
			| "nuevo"
			| "contactado"
			| "visita"
			| "cerrado"
			| "descartado"
			| undefined,
		limit,
		offset,
	});

	const totalPages = Math.ceil(total / limit);

	return (
		<>
			<AdminHeader
				title="Leads"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6 space-y-6">
				{/* Filters */}
				<StatusFilter current={params.status} />

				{/* Leads table */}
				<Card>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-zinc-50 border-b border-border">
								<tr>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Contacto
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Propiedad
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Fuente
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Estado
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Fecha
									</th>
									<th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{leads.length > 0 ? (
									leads.map((lead) => (
										<tr key={lead.id} className="hover:bg-zinc-50">
											<td className="px-4 py-3">
												<div>
													<p className="font-medium">{lead.name}</p>
													<div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
														{lead.email && (
															<span className="flex items-center gap-1">
																<EmailIcon className="h-3 w-3" />
																{lead.email}
															</span>
														)}
														{lead.phone && (
															<span className="flex items-center gap-1">
																<PhoneIcon className="h-3 w-3" />
																{lead.phone}
															</span>
														)}
													</div>
												</div>
											</td>
											<td className="px-4 py-3">
												{lead.property ? (
													<span className="text-sm">{lead.property.title}</span>
												) : (
													<span className="text-sm text-muted-foreground">
														Sin propiedad
													</span>
												)}
											</td>
											<td className="px-4 py-3">
												<Badge variant="secondary" className="capitalize">
													{lead.source}
												</Badge>
											</td>
											<td className="px-4 py-3">
												<StatusBadge status={lead.status} />
											</td>
											<td className="px-4 py-3 text-sm text-muted-foreground">
												{formatDate(lead.createdAt)}
											</td>
											<td className="px-4 py-3">
												<div className="flex justify-end gap-2">
													<Link href={`/admin/leads/${lead.id}`}>
														<Button variant="ghost" size="icon">
															<ViewIcon className="h-4 w-4" />
															<span className="sr-only">Ver detalles</span>
														</Button>
													</Link>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={6}
											className="px-4 py-12 text-center text-muted-foreground"
										>
											No hay leads
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
										href={`/admin/leads?pagina=${currentPage - 1}${params.status ? `&status=${params.status}` : ""}`}
									>
										<Button variant="outline" size="sm">
											Anterior
										</Button>
									</Link>
								)}
								{currentPage < totalPages && (
									<Link
										href={`/admin/leads?pagina=${currentPage + 1}${params.status ? `&status=${params.status}` : ""}`}
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
		{ value: "nuevo", label: "Nuevo" },
		{ value: "contactado", label: "Contactado" },
		{ value: "visita", label: "Visita" },
		{ value: "cerrado", label: "Cerrado" },
		{ value: "descartado", label: "Descartado" },
	];

	return (
		<div className="flex gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
			{statuses.map((status) => (
				<Link
					key={status.value ?? "all"}
					href={`/admin/leads${status.value ? `?status=${status.value}` : ""}`}
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
		nuevo: "bg-green-100 text-green-700",
		contactado: "bg-blue-100 text-blue-700",
		visita: "bg-purple-100 text-purple-700",
		cerrado: "bg-zinc-100 text-zinc-700",
		descartado: "bg-red-100 text-red-700",
	};

	return (
		<span
			className={`inline-block px-2 py-1 text-xs font-medium rounded capitalize ${variants[status] || "bg-zinc-100 text-zinc-700"}`}
		>
			{status}
		</span>
	);
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}
