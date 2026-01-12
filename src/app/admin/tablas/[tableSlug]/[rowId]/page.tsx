import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RowForm } from "@/components/admin/custom-tables/row-form";
import { Button } from "@/components/ui/button";

import { getCustomTableBySlug, getRowById } from "../../actions";

export const dynamic = "force-dynamic";

interface PageProps {
	params: Promise<{ tableSlug: string; rowId: string }>;
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
		title: `Editar Registro - ${result.table.name} | Casalia Admin`,
		description: `Editar registro de ${result.table.name}`,
	};
}

export default async function EditRowPage({ params }: PageProps) {
	const { tableSlug, rowId } = await params;

	const result = await getCustomTableBySlug(tableSlug);

	if (!result) {
		notFound();
	}

	const { table, columns } = result;
	const row = await getRowById(rowId);

	if (!row) {
		notFound();
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
					<h1 className="text-2xl font-bold tracking-tight">Editar Registro</h1>
					<p className="text-muted-foreground">{table.name}</p>
				</div>
			</div>

			{/* Form */}
			<div className="max-w-2xl">
				<RowForm
					tableId={table.id}
					tableSlug={table.slug}
					columns={columns}
					row={row}
				/>
			</div>
		</div>
	);
}
