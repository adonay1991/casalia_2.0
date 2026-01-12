"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomColumn, CustomRow } from "@/lib/db/schema";

import { createRow, updateRow } from "../../../app/admin/tablas/actions";

import { DynamicField } from "./dynamic-field";

interface RowFormProps {
	tableId: string;
	tableSlug: string;
	columns: CustomColumn[];
	row?: CustomRow;
}

export function RowForm({ tableId, tableSlug, columns, row }: RowFormProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [error, setError] = useState<string | null>(null);

	// Initialize form data from existing row or empty
	const [formData, setFormData] = useState<Record<string, unknown>>(() => {
		if (row?.data && typeof row.data === "object") {
			return row.data as Record<string, unknown>;
		}
		// Initialize with empty values for each column
		const initial: Record<string, unknown> = {};
		for (const col of columns) {
			initial[col.key] = col.columnType === "checkbox" ? false : "";
		}
		return initial;
	});

	// Update field value
	const handleFieldChange = useCallback((key: string, value: unknown) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	}, []);

	// Handle form submission
	const handleSubmit = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setError(null);

			// Validate required fields
			for (const col of columns) {
				if (col.isRequired) {
					const value = formData[col.key];
					if (value === undefined || value === null || value === "") {
						setError(`El campo "${col.name}" es obligatorio`);
						return;
					}
				}
			}

			startTransition(async () => {
				try {
					if (row) {
						await updateRow(row.id, formData);
					} else {
						await createRow(tableId, formData);
					}
					router.push(`/admin/tablas/${tableSlug}`);
				} catch (err) {
					setError(err instanceof Error ? err.message : "Error al guardar");
				}
			});
		},
		[columns, formData, row, tableId, tableSlug, router],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle>{row ? "Editar Registro" : "Nuevo Registro"}</CardTitle>
				<CardDescription>
					{row ? "Modifica los datos del registro" : "Completa los campos para crear un nuevo registro"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Dynamic fields */}
					{columns.map((column) => (
						<DynamicField
							key={column.id}
							column={column}
							value={formData[column.key]}
							onChange={(value) => handleFieldChange(column.key, value)}
						/>
					))}

					{/* Error message */}
					{error && (
						<div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
							{error}
						</div>
					)}

					{/* Submit buttons */}
					<div className="flex justify-end gap-3 pt-4 border-t">
						<Button type="button" variant="outline" asChild>
							<a href={`/admin/tablas/${tableSlug}`}>Cancelar</a>
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending
								? row
									? "Guardando..."
									: "Creando..."
								: row
									? "Guardar Cambios"
									: "Crear Registro"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
