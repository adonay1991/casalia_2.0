import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ColumnEditor } from "@/components/admin/custom-tables/column-editor";
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
		title: `Configurar ${result.table.name} | Casalia Admin`,
		description: `Editar columnas de ${result.table.name}`,
	};
}

export default async function EditTablePage({ params }: PageProps) {
	const { tableSlug } = await params;

	const result = await getCustomTableBySlug(tableSlug);

	if (!result) {
		notFound();
	}

	const { table, columns } = result;

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
					<h1 className="text-2xl font-bold tracking-tight">
						Configurar: {table.name}
					</h1>
					<p className="text-muted-foreground">
						Define las columnas y tipos de datos de tu tabla
					</p>
				</div>
			</div>

			{/* Column Editor */}
			<ColumnEditor tableId={table.id} tableSlug={table.slug} columns={columns} />
		</div>
	);
}
