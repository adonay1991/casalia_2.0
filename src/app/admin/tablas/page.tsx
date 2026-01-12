import {
	Plus as PlusIcon,
	Table as TableIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { TableList } from "@/components/admin/custom-tables/table-list";
import { Button } from "@/components/ui/button";

import { getCustomTables } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Tablas | Casalia Admin",
	description: "Gestiona tablas de datos personalizadas",
};

export default async function TablasPage() {
	const tables = await getCustomTables();

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
						<TableIcon className="h-7 w-7 text-[var(--casalia-orange)]" />
						Tablas de Datos
					</h1>
					<p className="text-muted-foreground mt-1">
						Crea y gestiona tablas personalizadas para tu negocio
					</p>
				</div>
				<Button asChild>
					<Link href="/admin/tablas/nueva">
						<PlusIcon className="h-4 w-4 mr-2" />
						Nueva Tabla
					</Link>
				</Button>
			</div>

			{/* Table List */}
			{tables.length === 0 ? (
				<div className="border border-dashed rounded-lg p-12 text-center">
					<TableIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
					<h3 className="text-lg font-medium">No hay tablas creadas</h3>
					<p className="text-muted-foreground mt-1 mb-4">
						Crea tu primera tabla para empezar a organizar datos
					</p>
					<Button asChild>
						<Link href="/admin/tablas/nueva">
							<PlusIcon className="h-4 w-4 mr-2" />
							Crear Primera Tabla
						</Link>
					</Button>
				</div>
			) : (
				<TableList tables={tables} />
			)}
		</div>
	);
}
