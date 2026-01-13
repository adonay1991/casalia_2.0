"use server";

import { eq, desc, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	customColumns,
	customRows,
	customTables,
	type ColumnConfig,
	type ColumnType,
	type CustomColumn,
	type CustomRow,
	type CustomTable,
} from "@/lib/db/schema";

// ===========================================
// Table Actions
// ===========================================

/**
 * Get all custom tables
 */
export async function getCustomTables(): Promise<CustomTable[]> {
	try {
		const tables = await db
			.select()
			.from(customTables)
			.orderBy(desc(customTables.createdAt));

		return tables;
	} catch {
		console.warn("getCustomTables: Database not available");
		return [];
	}
}

/**
 * Get a single custom table by slug with its columns
 */
export async function getCustomTableBySlug(slug: string): Promise<{
	table: CustomTable;
	columns: CustomColumn[];
} | null> {
	try {
		const [table] = await db
			.select()
			.from(customTables)
			.where(eq(customTables.slug, slug))
			.limit(1);

		if (!table) {
			return null;
		}

		const columns = await db
			.select()
			.from(customColumns)
			.where(eq(customColumns.tableId, table.id))
			.orderBy(asc(customColumns.order));

		return { table, columns };
	} catch {
		console.warn("getCustomTableBySlug: Database not available");
		return null;
	}
}

/**
 * Create a new custom table
 */
export async function createCustomTable(formData: FormData): Promise<void> {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("No autorizado");
	}

	const name = formData.get("name") as string;
	const description = formData.get("description") as string | null;
	const icon = formData.get("icon") as string | null;

	if (!name || name.trim() === "") {
		throw new Error("El nombre es requerido");
	}

	// Generate slug from name
	const slug = name
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

	// Check if slug already exists
	const existing = await db
		.select()
		.from(customTables)
		.where(eq(customTables.slug, slug))
		.limit(1);

	if (existing.length > 0) {
		throw new Error("Ya existe una tabla con ese nombre");
	}

	const [created] = await db
		.insert(customTables)
		.values({
			name: name.trim(),
			slug,
			description: description?.trim() || null,
			icon: icon?.trim() || null,
			createdBy: user.id,
		})
		.returning();

	revalidatePath("/admin/tablas");
	redirect(`/admin/tablas/${created?.slug ?? slug}`);
}

/**
 * Update an existing custom table
 */
export async function updateCustomTable(
	tableId: string,
	formData: FormData,
): Promise<void> {
	const name = formData.get("name") as string;
	const description = formData.get("description") as string | null;
	const icon = formData.get("icon") as string | null;

	if (!name || name.trim() === "") {
		throw new Error("El nombre es requerido");
	}

	await db
		.update(customTables)
		.set({
			name: name.trim(),
			description: description?.trim() || null,
			icon: icon?.trim() || null,
			updatedAt: new Date(),
		})
		.where(eq(customTables.id, tableId));

	revalidatePath("/admin/tablas");
}

/**
 * Delete a custom table and all its data
 */
export async function deleteCustomTable(tableId: string): Promise<void> {
	await db.delete(customTables).where(eq(customTables.id, tableId));

	revalidatePath("/admin/tablas");
	redirect("/admin/tablas");
}

// ===========================================
// Column Actions
// ===========================================

interface ColumnInput {
	name: string;
	key: string;
	columnType: ColumnType;
	isRequired?: boolean;
	order: number;
	options?: string[];
	config?: ColumnConfig;
}

/**
 * Save columns for a table (creates or updates)
 */
export async function saveTableColumns(
	tableId: string,
	columns: ColumnInput[],
): Promise<void> {
	// Delete existing columns
	await db.delete(customColumns).where(eq(customColumns.tableId, tableId));

	// Insert new columns
	if (columns.length > 0) {
		await db.insert(customColumns).values(
			columns.map((col) => ({
				tableId,
				name: col.name,
				key: col.key,
				columnType: col.columnType,
				isRequired: col.isRequired ?? false,
				order: col.order,
				options: col.options ?? null,
				config: col.config ?? null,
			})),
		);
	}

	revalidatePath("/admin/tablas");
}

/**
 * Get columns for a table
 */
export async function getTableColumns(tableId: string): Promise<CustomColumn[]> {
	try {
		const columns = await db
			.select()
			.from(customColumns)
			.where(eq(customColumns.tableId, tableId))
			.orderBy(asc(customColumns.order));

		return columns;
	} catch {
		console.warn("getTableColumns: Database not available");
		return [];
	}
}

// ===========================================
// Row Actions
// ===========================================

/**
 * Get rows for a table with pagination
 */
export async function getTableRows(
	tableId: string,
	options?: {
		page?: number;
		limit?: number;
	},
): Promise<{
	rows: CustomRow[];
	total: number;
	page: number;
	limit: number;
}> {
	const page = options?.page ?? 1;
	const limit = options?.limit ?? 50;

	try {
		const offset = (page - 1) * limit;

		const rows = await db
			.select()
			.from(customRows)
			.where(eq(customRows.tableId, tableId))
			.orderBy(desc(customRows.createdAt))
			.limit(limit)
			.offset(offset);

		// Count total rows
		const allRows = await db
			.select()
			.from(customRows)
			.where(eq(customRows.tableId, tableId));

		return {
			rows,
			total: allRows.length,
			page,
			limit,
		};
	} catch {
		console.warn("getTableRows: Database not available");
		return {
			rows: [],
			total: 0,
			page,
			limit,
		};
	}
}

/**
 * Get a single row by ID
 */
export async function getRowById(rowId: string): Promise<CustomRow | null> {
	try {
		const [row] = await db
			.select()
			.from(customRows)
			.where(eq(customRows.id, rowId))
			.limit(1);

		return row ?? null;
	} catch {
		console.warn("getRowById: Database not available");
		return null;
	}
}

/**
 * Create a new row
 */
export async function createRow(
	tableId: string,
	data: Record<string, unknown>,
): Promise<CustomRow> {
	const user = await getCurrentUser();

	const [row] = await db
		.insert(customRows)
		.values({
			tableId,
			data,
			createdBy: user?.id ?? null,
		})
		.returning();

	if (!row) {
		throw new Error("Error al crear la fila");
	}

	revalidatePath("/admin/tablas");
	return row;
}

/**
 * Update an existing row
 */
export async function updateRow(
	rowId: string,
	data: Record<string, unknown>,
): Promise<void> {
	await db
		.update(customRows)
		.set({
			data,
			updatedAt: new Date(),
		})
		.where(eq(customRows.id, rowId));

	revalidatePath("/admin/tablas");
}

/**
 * Delete a row
 */
export async function deleteRow(rowId: string): Promise<void> {
	await db.delete(customRows).where(eq(customRows.id, rowId));

	revalidatePath("/admin/tablas");
}

/**
 * Delete multiple rows
 */
export async function deleteRows(rowIds: string[]): Promise<void> {
	for (const id of rowIds) {
		await db.delete(customRows).where(eq(customRows.id, id));
	}

	revalidatePath("/admin/tablas");
}
