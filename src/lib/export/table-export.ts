/**
 * Table export utilities
 * Handles exporting custom table data to CSV format
 */

import type { CustomColumn, CustomRow } from "@/lib/db/schema";

/**
 * Format a cell value for CSV export
 */
function formatCellValueForCSV(value: unknown, columnType: string): string {
	if (value === null || value === undefined) {
		return "";
	}

	switch (columnType) {
		case "checkbox":
			return value ? "Si" : "No";

		case "date":
			if (typeof value === "string") {
				return new Date(value).toLocaleDateString("es-ES");
			}
			return String(value);

		case "number":
			if (typeof value === "number") {
				return value.toString();
			}
			return String(value);

		default:
			return String(value);
	}
}

/**
 * Escape a value for CSV (handles quotes and commas)
 */
function escapeCSV(value: string): string {
	if (value.includes(",") || value.includes('"') || value.includes("\n")) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

/**
 * Generate CSV content from table data
 */
export function generateCSV(
	columns: CustomColumn[],
	rows: CustomRow[],
): string {
	// Header row
	const headers = columns.map((col) => escapeCSV(col.name));
	const headerLine = headers.join(",");

	// Data rows
	const dataLines = rows.map((row) => {
		const data = row.data as Record<string, unknown>;
		const cells = columns.map((col) => {
			const value = data[col.key];
			const formatted = formatCellValueForCSV(value, col.columnType);
			return escapeCSV(formatted);
		});
		return cells.join(",");
	});

	// Combine with BOM for Excel compatibility with UTF-8
	return "\uFEFF" + [headerLine, ...dataLines].join("\n");
}

/**
 * Download CSV file
 */
export function downloadCSV(filename: string, content: string): void {
	const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${filename}.csv`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * Export table data to CSV and trigger download
 */
export function exportTableToCSV(
	tableName: string,
	columns: CustomColumn[],
	rows: CustomRow[],
): void {
	const csv = generateCSV(columns, rows);
	const filename = `${tableName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}`;
	downloadCSV(filename, csv);
}
