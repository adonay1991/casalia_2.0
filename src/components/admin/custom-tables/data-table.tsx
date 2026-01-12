"use client";

import {
	CaretLeft as ChevronLeftIcon,
	CaretRight as ChevronRightIcon,
	DotsThree as MoreIcon,
	PencilSimple as EditIcon,
	Trash as DeleteIcon,
	CheckSquare,
	Square,
	Link as LinkIcon,
	File as FileIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { CustomColumn, CustomRow } from "@/lib/db/schema";

import { deleteRow } from "../../../app/admin/tablas/actions";

interface DataTableProps {
	tableSlug: string;
	columns: CustomColumn[];
	rows: CustomRow[];
	currentPage: number;
	totalPages: number;
	totalRows: number;
}

function formatCellValue(
	value: unknown,
	columnType: string,
): React.ReactNode {
	if (value === null || value === undefined) {
		return <span className="text-muted-foreground">-</span>;
	}

	switch (columnType) {
		case "checkbox":
			return value ? (
				<CheckSquare className="h-5 w-5 text-green-600" weight="fill" />
			) : (
				<Square className="h-5 w-5 text-muted-foreground" />
			);

		case "date":
			if (typeof value === "string") {
				return new Date(value).toLocaleDateString("es-ES", {
					year: "numeric",
					month: "short",
					day: "numeric",
				});
			}
			return String(value);

		case "number":
			if (typeof value === "number") {
				return value.toLocaleString("es-ES");
			}
			return String(value);

		case "link":
			if (typeof value === "string" && value.startsWith("http")) {
				return (
					<a
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline flex items-center gap-1"
					>
						<LinkIcon className="h-4 w-4" />
						Enlace
					</a>
				);
			}
			return String(value);

		case "file":
			if (typeof value === "string" && value.startsWith("http")) {
				return (
					<a
						href={value}
						target="_blank"
						rel="noopener noreferrer"
						className="text-blue-600 hover:underline flex items-center gap-1"
					>
						<FileIcon className="h-4 w-4" />
						Archivo
					</a>
				);
			}
			return String(value);

		case "dropdown":
		case "text":
		default:
			return String(value);
	}
}

export function DataTable({
	tableSlug,
	columns,
	rows,
	currentPage,
	totalPages,
	totalRows,
}: DataTableProps) {
	const [isPending, startTransition] = useTransition();

	const handleDelete = (rowId: string) => {
		if (!confirm("¿Estas seguro de eliminar este registro?")) return;

		startTransition(async () => {
			await deleteRow(rowId);
		});
	};

	if (rows.length === 0) {
		return (
			<div className="border rounded-lg p-12 text-center">
				<p className="text-muted-foreground">No hay registros en esta tabla</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Table */}
			<div className="border rounded-lg overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead key={column.id} className="whitespace-nowrap">
									{column.name}
									{column.isRequired && (
										<span className="text-red-500 ml-1">*</span>
									)}
								</TableHead>
							))}
							<TableHead className="w-[80px]">Acciones</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{rows.map((row) => (
							<TableRow key={row.id}>
								{columns.map((column) => (
									<TableCell key={column.id} className="max-w-[300px] truncate">
										{formatCellValue(
											(row.data as Record<string, unknown>)[column.key],
											column.columnType,
										)}
									</TableCell>
								))}
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" disabled={isPending}>
												<MoreIcon className="h-5 w-5" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem asChild>
												<Link href={`/admin/tablas/${tableSlug}/${row.id}`}>
													<EditIcon className="h-4 w-4 mr-2" />
													Editar
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600"
												onClick={() => handleDelete(row.id)}
											>
												<DeleteIcon className="h-4 w-4 mr-2" />
												Eliminar
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">
					{totalRows} registro{totalRows !== 1 && "s"} en total
				</p>
				{totalPages > 1 && (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={currentPage <= 1}
							asChild={currentPage > 1}
						>
							{currentPage > 1 ? (
								<Link href={`?page=${currentPage - 1}`}>
									<ChevronLeftIcon className="h-4 w-4" />
								</Link>
							) : (
								<span>
									<ChevronLeftIcon className="h-4 w-4" />
								</span>
							)}
						</Button>
						<span className="text-sm">
							Pagina {currentPage} de {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={currentPage >= totalPages}
							asChild={currentPage < totalPages}
						>
							{currentPage < totalPages ? (
								<Link href={`?page=${currentPage + 1}`}>
									<ChevronRightIcon className="h-4 w-4" />
								</Link>
							) : (
								<span>
									<ChevronRightIcon className="h-4 w-4" />
								</span>
							)}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
