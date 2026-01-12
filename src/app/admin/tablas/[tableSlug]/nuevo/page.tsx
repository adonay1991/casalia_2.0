import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RowForm } from "@/components/admin/custom-tables/row-form";
import { Button } from "@/components/ui/button";

import { getCustomTableBySlug } from "../../actions";

interface PageProps {
	params: Promise<{ tableSlug: string }>;
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
		title: `Nuevo Registro - ${result.table.name} | Casalia Admin`,
		description: `Agregar registro a ${result.table.name}`,
	};
}

export default async function NewRowPage({ params }: PageProps) {
	const { tableSlug } = await params;

	const result = await getCustomTableBySlug(tableSlug);

	if (!result) {
		notFound();
	}

	const { table, columns } = result;

	if (columns.length === 0) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href={`/admin/tablas/${table.slug}`}>
							<BackIcon className="h-5 w-5" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold tracking-tight">Nuevo Registro</h1>
						<p className="text-muted-foreground">{table.name}</p>
					</div>
				</div>
				<div className="border border-dashed rounded-lg p-12 text-center">
					<p className="text-muted-foreground">
						Debes configurar columnas antes de agregar registros
					</p>
					<Button asChild className="mt-4">
						<Link href={`/admin/tablas/${table.slug}/editar`}>
							Configurar Columnas
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href={`/admin/tablas/${table.slug}`}>
						<BackIcon className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Nuevo Registro</h1>
					<p className="text-muted-foreground">{table.name}</p>
				</div>
			</div>

			{/* Form */}
			<div className="max-w-2xl">
				<RowForm
					tableId={table.id}
					tableSlug={table.slug}
					columns={columns}
				/>
			</div>
		</div>
	);
}
