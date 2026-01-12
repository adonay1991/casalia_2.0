import {
	ArrowLeft as BackIcon,
	Gear as EditIcon,
	Plus as PlusIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DataTable } from "@/components/admin/custom-tables/data-table";
import { ExportButton } from "@/components/admin/custom-tables/export-button";
import { Button } from "@/components/ui/button";

import { getCustomTableBySlug, getTableRows } from "../actions";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ tableSlug: string }>;
	searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { tableSlug } = await params;
	const result = await getCustomTableBySlug(tableSlug);

	if (!result) {
		return { title: "Tabla no encontrada" };
	}

	return {
		title: `${result.table.name} | Casalia Admin`,
		description: result.table.description ?? `Datos de ${result.table.name}`,
	};
}

export default async function TableViewPage({
	params,
	searchParams,
}: PageProps) {
	const { tableSlug } = await params;
	const { page: pageParam } = await searchParams;
	const page = pageParam ? Number.parseInt(pageParam, 10) : 1;

	const result = await getCustomTableBySlug(tableSlug);

	if (!result) {
		notFound();
	}

	const { table, columns } = result;
	const { rows, total, limit } = await getTableRows(table.id, { page });

	const totalPages = Math.ceil(total / limit);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/admin/tablas">
							<BackIcon className="h-5 w-5" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">{table.name}</h1>
						{table.description && (
							<p className="text-muted-foreground">{table.description}</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<ExportButton
						tableId={table.id}
						tableName={table.name}
						columns={columns}
					/>
					<Button variant="outline" asChild>
						<Link href={`/admin/tablas/${table.slug}/editar`}>
							<EditIcon className="h-4 w-4 mr-2" />
							Configurar
						</Link>
					</Button>
					<Button asChild>
						<Link href={`/admin/tablas/${table.slug}/nuevo`}>
							<PlusIcon className="h-4 w-4 mr-2" />
							Nuevo Registro
						</Link>
					</Button>
				</div>
			</div>

			{/* Data Table */}
			{columns.length === 0 ? (
				<div className="border border-dashed rounded-lg p-12 text-center">
					<EditIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
					<h3 className="text-lg font-medium">No hay columnas configuradas</h3>
					<p className="text-muted-foreground mt-1 mb-4">
						Configura las columnas de tu tabla para empezar a agregar datos
					</p>
					<Button asChild>
						<Link href={`/admin/tablas/${table.slug}/editar`}>
							<EditIcon className="h-4 w-4 mr-2" />
							Configurar Columnas
						</Link>
					</Button>
				</div>
			) : (
				<DataTable
					tableSlug={table.slug}
					columns={columns}
					rows={rows}
					currentPage={page}
					totalPages={totalPages}
					totalRows={total}
				/>
			)}
		</div>
	);
}
