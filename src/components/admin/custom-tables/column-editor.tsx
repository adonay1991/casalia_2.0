"use client";

import {
	DotsSixVertical as DragIcon,
	Plus as PlusIcon,
	Trash as DeleteIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ColumnType, CustomColumn } from "@/lib/db/schema";

import { saveTableColumns } from "../../../app/admin/tablas/actions";

interface ColumnEditorProps {
	tableId: string;
	tableSlug: string;
	columns: CustomColumn[];
}

interface ColumnDraft {
	id: string;
	name: string;
	key: string;
	columnType: ColumnType;
	isRequired: boolean;
	order: number;
	options?: string[];
}

const columnTypes: { value: ColumnType; label: string }[] = [
	{ value: "text", label: "Texto" },
	{ value: "number", label: "Numero" },
	{ value: "date", label: "Fecha" },
	{ value: "checkbox", label: "Si/No" },
	{ value: "file", label: "Archivo" },
	{ value: "link", label: "Enlace" },
	{ value: "dropdown", label: "Desplegable" },
];

function generateKey(name: string): string {
	return name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");
}

function createEmptyColumn(order: number): ColumnDraft {
	return {
		id: `new-${Date.now()}-${Math.random().toString(36).substring(7)}`,
		name: "",
		key: "",
		columnType: "text",
		isRequired: false,
		order,
	};
}

export function ColumnEditor({ tableId, tableSlug, columns }: ColumnEditorProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	// Initialize columns from props
	const [draftColumns, setDraftColumns] = useState<ColumnDraft[]>(() =>
		columns.length > 0
			? columns.map((col) => ({
					id: col.id,
					name: col.name,
					key: col.key,
					columnType: col.columnType as ColumnType,
					isRequired: col.isRequired ?? false,
					order: col.order,
					options: col.options ?? undefined,
				}))
			: [createEmptyColumn(0)],
	);

	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

	// Add new column
	const addColumn = useCallback(() => {
		setDraftColumns((prev) => [...prev, createEmptyColumn(prev.length)]);
	}, []);

	// Remove column
	const removeColumn = useCallback((index: number) => {
		setDraftColumns((prev) => {
			const newColumns = prev.filter((_, i) => i !== index);
			// Re-order remaining columns
			return newColumns.map((col, i) => ({ ...col, order: i }));
		});
	}, []);

	// Update column field
	const updateColumn = useCallback(
		(index: number, field: keyof ColumnDraft, value: unknown) => {
			setDraftColumns((prev) => {
				const newColumns = [...prev];
				const column = newColumns[index];
				if (!column) return prev;

				newColumns[index] = { ...column, [field]: value };

				// Auto-generate key when name changes
				if (field === "name" && typeof value === "string") {
					newColumns[index] = {
						...newColumns[index],
						key: generateKey(value),
					} as ColumnDraft;
				}

				return newColumns;
			});
		},
		[],
	);

	// Drag handlers
	const handleDragStart = useCallback((index: number) => {
		setDraggedIndex(index);
	}, []);

	const handleDragOver = useCallback(
		(e: React.DragEvent, index: number) => {
			e.preventDefault();
			if (draggedIndex !== null && draggedIndex !== index) {
				setDragOverIndex(index);
			}
		},
		[draggedIndex],
	);

	const handleDragEnd = useCallback(() => {
		if (draggedIndex !== null && dragOverIndex !== null) {
			setDraftColumns((prev) => {
				const newColumns = [...prev];
				const draggedColumn = newColumns[draggedIndex];
				if (!draggedColumn) return prev;

				newColumns.splice(draggedIndex, 1);
				newColumns.splice(dragOverIndex, 0, draggedColumn);

				// Re-order
				return newColumns.map((col, i) => ({ ...col, order: i }));
			});
		}
		setDraggedIndex(null);
		setDragOverIndex(null);
	}, [draggedIndex, dragOverIndex]);

	// Save columns
	const handleSave = useCallback(() => {
		setError(null);

		// Validate
		for (const col of draftColumns) {
			if (!col.name.trim()) {
				setError("Todas las columnas deben tener un nombre");
				return;
			}
			if (!col.key.trim()) {
				setError("Todas las columnas deben tener una clave");
				return;
			}
		}

		// Check for duplicate keys
		const keys = draftColumns.map((c) => c.key);
		const uniqueKeys = new Set(keys);
		if (keys.length !== uniqueKeys.size) {
			setError("Las claves de columna deben ser unicas");
			return;
		}

		startTransition(async () => {
			try {
				await saveTableColumns(
					tableId,
					draftColumns.map((col) => ({
						name: col.name,
						key: col.key,
						columnType: col.columnType,
						isRequired: col.isRequired,
						order: col.order,
						options: col.options,
					})),
				);
				router.push(`/admin/tablas/${tableSlug}`);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Error al guardar");
			}
		});
	}, [draftColumns, tableId, tableSlug, router]);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Columnas de la tabla</CardTitle>
				<CardDescription>
					Arrastra para reordenar. Cada columna define un campo de datos.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Column list */}
				<div className="space-y-3">
					{draftColumns.map((column, index) => (
						<div
							key={column.id}
							draggable
							onDragStart={() => handleDragStart(index)}
							onDragOver={(e) => handleDragOver(e, index)}
							onDragEnd={handleDragEnd}
							className={`
								flex items-start gap-3 p-4 border rounded-lg bg-card transition-all
								${draggedIndex === index ? "opacity-50" : ""}
								${dragOverIndex === index ? "border-[var(--casalia-orange)] border-2" : ""}
							`}
						>
							{/* Drag handle */}
							<div className="cursor-grab active:cursor-grabbing pt-2">
								<DragIcon className="h-5 w-5 text-muted-foreground" />
							</div>

							{/* Column fields */}
							<div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
								{/* Name */}
								<div className="space-y-1">
									<Label className="text-xs">Nombre</Label>
									<Input
										value={column.name}
										onChange={(e) => updateColumn(index, "name", e.target.value)}
										placeholder="Nombre de la columna"
									/>
								</div>

								{/* Key */}
								<div className="space-y-1">
									<Label className="text-xs">Clave</Label>
									<Input
										value={column.key}
										onChange={(e) => updateColumn(index, "key", e.target.value)}
										placeholder="clave_columna"
										className="font-mono text-sm"
									/>
								</div>

								{/* Type */}
								<div className="space-y-1">
									<Label className="text-xs">Tipo</Label>
									<Select
										value={column.columnType}
										onValueChange={(value) =>
											updateColumn(index, "columnType", value as ColumnType)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{columnTypes.map((type) => (
												<SelectItem key={type.value} value={type.value}>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Required checkbox */}
								<div className="flex items-center gap-2 pt-6">
									<Checkbox
										id={`required-${column.id}`}
										checked={column.isRequired}
										onCheckedChange={(checked) =>
											updateColumn(index, "isRequired", checked === true)
										}
									/>
									<Label htmlFor={`required-${column.id}`} className="text-sm">
										Obligatorio
									</Label>
								</div>
							</div>

							{/* Dropdown options (shown only for dropdown type) */}
							{column.columnType === "dropdown" && (
								<div className="w-full md:ml-8 mt-2">
									<Label className="text-xs">Opciones (separadas por coma)</Label>
									<Input
										value={column.options?.join(", ") ?? ""}
										onChange={(e) =>
											updateColumn(
												index,
												"options",
												e.target.value.split(",").map((s) => s.trim()),
											)
										}
										placeholder="Opcion 1, Opcion 2, Opcion 3"
									/>
								</div>
							)}

							{/* Delete button */}
							<Button
								variant="ghost"
								size="icon"
								className="text-muted-foreground hover:text-red-600"
								onClick={() => removeColumn(index)}
								disabled={draftColumns.length === 1}
							>
								<DeleteIcon className="h-5 w-5" />
							</Button>
						</div>
					))}
				</div>

				{/* Add column button */}
				<Button variant="outline" onClick={addColumn} className="w-full">
					<PlusIcon className="h-4 w-4 mr-2" />
					Agregar Columna
				</Button>

				{/* Error message */}
				{error && (
					<div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
						{error}
					</div>
				)}

				{/* Save button */}
				<div className="flex justify-end gap-3 pt-4 border-t">
					<Button variant="outline" asChild>
						<a href={`/admin/tablas/${tableSlug}`}>Cancelar</a>
					</Button>
					<Button onClick={handleSave} disabled={isPending}>
						{isPending ? "Guardando..." : "Guardar Columnas"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
