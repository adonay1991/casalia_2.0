"use client";

import { CloudArrowUp as UploadIcon } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

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
import type { CustomColumn } from "@/lib/db/schema";

interface DynamicFieldProps {
	column: CustomColumn;
	value: unknown;
	onChange: (value: unknown) => void;
}

export function DynamicField({ column, value, onChange }: DynamicFieldProps) {
	const [isUploading, setIsUploading] = useState(false);

	// File upload handler
	const handleFileUpload = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;

			setIsUploading(true);

			// For now, we'll use a simple file upload
			// In production, this would upload to Supabase Storage
			const formData = new FormData();
			formData.append("file", file);
			formData.append("propertyId", "custom-table-files"); // Generic bucket path

			try {
				const response = await fetch("/api/images/process", {
					method: "POST",
					body: formData,
				});

				const result = await response.json();
				if (result.success && result.url) {
					onChange(result.url);
				}
			} catch (error) {
				console.error("File upload failed:", error);
			} finally {
				setIsUploading(false);
			}
		},
		[onChange],
	);

	// Render field based on type
	const renderField = () => {
		switch (column.columnType) {
			case "text":
				return (
					<Input
						id={column.key}
						value={(value as string) ?? ""}
						onChange={(e) => onChange(e.target.value)}
						placeholder={column.config?.placeholder as string}
					/>
				);

			case "number":
				return (
					<Input
						id={column.key}
						type="number"
						value={(value as number) ?? ""}
						onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
						min={column.config?.min as number}
						max={column.config?.max as number}
						placeholder={column.config?.placeholder as string}
					/>
				);

			case "date":
				return (
					<Input
						id={column.key}
						type="date"
						value={(value as string) ?? ""}
						onChange={(e) => onChange(e.target.value)}
					/>
				);

			case "checkbox":
				return (
					<div className="flex items-center gap-2 pt-2">
						<Checkbox
							id={column.key}
							checked={(value as boolean) ?? false}
							onCheckedChange={(checked) => onChange(checked === true)}
						/>
						<Label htmlFor={column.key} className="text-sm font-normal">
							Si
						</Label>
					</div>
				);

			case "link":
				return (
					<Input
						id={column.key}
						type="url"
						value={(value as string) ?? ""}
						onChange={(e) => onChange(e.target.value)}
						placeholder="https://..."
					/>
				);

			case "file":
				return (
					<div className="space-y-2">
						{typeof value === "string" && value ? (
							<div className="text-sm text-muted-foreground">
								<a
									href={value}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 hover:underline"
								>
									Ver archivo actual
								</a>
							</div>
						) : null}
						<div className="relative">
							<Input
								id={column.key}
								type="file"
								onChange={handleFileUpload}
								disabled={isUploading}
								className="cursor-pointer"
							/>
							{isUploading && (
								<div className="absolute inset-0 flex items-center justify-center bg-background/80">
									<UploadIcon className="h-5 w-5 animate-pulse" />
									<span className="ml-2 text-sm">Subiendo...</span>
								</div>
							)}
						</div>
					</div>
				);

			case "dropdown":
				return (
					<Select
						value={(value as string) ?? ""}
						onValueChange={(val) => onChange(val)}
					>
						<SelectTrigger id={column.key}>
							<SelectValue placeholder="Seleccionar..." />
						</SelectTrigger>
						<SelectContent>
							{column.options?.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);

			default:
				return (
					<Input
						id={column.key}
						value={(value as string) ?? ""}
						onChange={(e) => onChange(e.target.value)}
					/>
				);
		}
	};

	return (
		<div className="space-y-2">
			<Label htmlFor={column.key}>
				{column.name}
				{column.isRequired && <span className="text-red-500 ml-1">*</span>}
			</Label>
			{renderField()}
		</div>
	);
}
