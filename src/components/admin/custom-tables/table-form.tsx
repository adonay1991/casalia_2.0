"use client";

import {
	AddressBook,
	Briefcase,
	Buildings,
	ClipboardText,
	FileText,
	Folder,
	Gear,
	Table as TableIcon,
	Users,
} from "@phosphor-icons/react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CustomTable } from "@/lib/db/schema";

interface TableFormProps {
	action: (formData: FormData) => Promise<void>;
	table?: CustomTable;
}

const icons = [
	{ name: "table", icon: TableIcon, label: "Tabla" },
	{ name: "users", icon: Users, label: "Usuarios" },
	{ name: "buildings", icon: Buildings, label: "Edificios" },
	{ name: "briefcase", icon: Briefcase, label: "Maletin" },
	{ name: "folder", icon: Folder, label: "Carpeta" },
	{ name: "clipboard-text", icon: ClipboardText, label: "Lista" },
	{ name: "file-text", icon: FileText, label: "Documento" },
	{ name: "address-book", icon: AddressBook, label: "Contactos" },
	{ name: "gear", icon: Gear, label: "Config" },
];

export function TableForm({ action, table }: TableFormProps) {
	const [selectedIcon, setSelectedIcon] = useState(table?.icon ?? "table");
	const [error, formAction, isPending] = useActionState(
		async (_prevState: string | null, formData: FormData) => {
			try {
				formData.set("icon", selectedIcon);
				await action(formData);
				return null;
			} catch (err) {
				return err instanceof Error ? err.message : "Error desconocido";
			}
		},
		null,
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{table ? "Editar Tabla" : "Crear Tabla"}</CardTitle>
				<CardDescription>
					{table
						? "Modifica la informacion de la tabla"
						: "Define el nombre y descripcion de tu nueva tabla"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-6">
					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Nombre de la tabla *</Label>
						<Input
							id="name"
							name="name"
							placeholder="Ej: Clientes, Captaciones, Inventario..."
							defaultValue={table?.name ?? ""}
							required
						/>
					</div>

					{/* Description */}
					<div className="space-y-2">
						<Label htmlFor="description">Descripcion (opcional)</Label>
						<Textarea
							id="description"
							name="description"
							placeholder="Describe para que se usara esta tabla..."
							defaultValue={table?.description ?? ""}
							rows={3}
						/>
					</div>

					{/* Icon selector */}
					<div className="space-y-2">
						<Label>Icono</Label>
						<div className="grid grid-cols-5 gap-2">
							{icons.map(({ name, icon: Icon, label }) => (
								<button
									key={name}
									type="button"
									onClick={() => setSelectedIcon(name)}
									className={`
										flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors
										${
											selectedIcon === name
												? "border-[var(--casalia-orange)] bg-[var(--casalia-orange)]/10"
												: "border-border hover:border-muted-foreground/50"
										}
									`}
								>
									<Icon
										className={`h-5 w-5 ${
											selectedIcon === name
												? "text-[var(--casalia-orange)]"
												: "text-muted-foreground"
										}`}
									/>
									<span className="text-xs text-muted-foreground">{label}</span>
								</button>
							))}
						</div>
					</div>

					{/* Error message */}
					{error && (
						<div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
							{error}
						</div>
					)}

					{/* Submit button */}
					<div className="flex justify-end gap-3">
						<Button type="submit" disabled={isPending}>
							{isPending
								? table
									? "Guardando..."
									: "Creando..."
								: table
									? "Guardar Cambios"
									: "Crear Tabla"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
