import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { TableForm } from "@/components/admin/custom-tables/table-form";
import { Button } from "@/components/ui/button";

import { createCustomTable } from "../actions";

export const metadata: Metadata = {
	title: "Nueva Tabla | Casalia Admin",
	description: "Crear una nueva tabla de datos personalizada",
};

export default function NuevaTablaPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="icon" asChild>
					<Link href="/admin/tablas">
						<BackIcon className="h-5 w-5" />
					</Link>
				</Button>
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Nueva Tabla</h1>
					<p className="text-muted-foreground">
						Crea una nueva tabla para organizar tus datos
					</p>
				</div>
			</div>

			{/* Form */}
			<div className="max-w-2xl">
				<TableForm action={createCustomTable} />
			</div>
		</div>
	);
}
