"use client";

import { Export as ExportIcon } from "@phosphor-icons/react";
import { useCallback, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { exportTableToCSV } from "@/lib/export/table-export";
import type { CustomColumn } from "@/lib/db/schema";

import { getTableRows } from "../../../app/admin/tablas/actions";

interface ExportButtonProps {
	tableId: string;
	tableName: string;
	columns: CustomColumn[];
}

export function ExportButton({ tableId, tableName, columns }: ExportButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [isOpen, setIsOpen] = useState(false);

	const handleExportCSV = useCallback(() => {
		startTransition(async () => {
			try {
				// Fetch all rows (no pagination)
				const { rows } = await getTableRows(tableId, { limit: 10000 });
				exportTableToCSV(tableName, columns, rows);
				setIsOpen(false);
			} catch (error) {
				console.error("Export failed:", error);
			}
		});
	}, [tableId, tableName, columns]);

	if (columns.length === 0) {
		return null;
	}

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" disabled={isPending}>
					<ExportIcon className="h-4 w-4 mr-2" />
					{isPending ? "Exportando..." : "Exportar"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleExportCSV} disabled={isPending}>
					Exportar a CSV
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
