"use client";

import {
	Trash as DeleteIcon,
	DotsSixVertical as DragIcon,
	Image as ImageIcon,
	SpinnerGap as SpinnerIcon,
	Star as StarIcon,
	CloudArrowUp as UploadIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ImageUploadResult } from "@/lib/images";

interface PropertyImage {
	id?: string;
	url: string;
	order: number;
	isPrimary: boolean;
}

interface ImageUploaderProps {
	propertyId: string;
	images: PropertyImage[];
	onImagesChange: (images: PropertyImage[]) => void;
	disabled?: boolean;
}

export function ImageUploader({
	propertyId,
	images,
	onImagesChange,
	disabled = false,
}: ImageUploaderProps) {
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<string | null>(null);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	}, []);

	const processFiles = useCallback(
		async (files: FileList | File[]) => {
			if (disabled || isUploading) return;

			const validFiles = Array.from(files).filter((file) =>
				["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
					file.type,
				),
			);

			if (validFiles.length === 0) return;

			setIsUploading(true);
			const newImages: PropertyImage[] = [];

			for (let i = 0; i < validFiles.length; i++) {
				const file = validFiles[i];
				if (!file) continue;

				setUploadProgress(
					`Procesando y subiendo ${i + 1} de ${validFiles.length}...`,
				);

				// Use the new API route for processing (WebP conversion + watermark)
				const formData = new FormData();
				formData.append("file", file);
				formData.append("propertyId", propertyId);

				try {
					const response = await fetch("/api/images/process", {
						method: "POST",
						body: formData,
					});

					const result: ImageUploadResult = await response.json();

					if (result.success && result.url) {
						const currentLength = images.length + newImages.length;
						newImages.push({
							url: result.url,
							order: currentLength,
							isPrimary: currentLength === 0, // First image is primary by default
						});
					}
				} catch (error) {
					console.error("Error uploading image:", error);
				}
			}

			if (newImages.length > 0) {
				onImagesChange([...images, ...newImages]);
			}

			setIsUploading(false);
			setUploadProgress(null);
		},
		[disabled, isUploading, propertyId, images, onImagesChange],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const files = e.dataTransfer.files;
			processFiles(files);
		},
		[processFiles],
	);

	const handleFileInput = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = e.target.files;
			if (files) {
				processFiles(files);
			}
			// Reset input
			e.target.value = "";
		},
		[processFiles],
	);

	const handleRemoveImage = useCallback(
		(index: number) => {
			const newImages = images.filter((_, i) => i !== index);
			// Reorder and ensure there's always a primary if images exist
			const reordered = newImages.map((img, i) => ({
				...img,
				order: i,
				isPrimary: i === 0 ? true : img.isPrimary && i !== 0 ? false : false,
			}));
			// Ensure first image is primary if no primary exists
			if (reordered.length > 0 && !reordered.some((img) => img.isPrimary)) {
				reordered[0] = { ...reordered[0], isPrimary: true };
			}
			onImagesChange(reordered);
		},
		[images, onImagesChange],
	);

	const handleSetPrimary = useCallback(
		(index: number) => {
			const newImages = images.map((img, i) => ({
				...img,
				isPrimary: i === index,
			}));
			onImagesChange(newImages);
		},
		[images, onImagesChange],
	);

	const handleReorder = useCallback(
		(dragIndex: number, dropIndex: number) => {
			if (dragIndex === dropIndex) return;

			const newImages = [...images];
			const [draggedImage] = newImages.splice(dragIndex, 1);
			if (draggedImage) {
				newImages.splice(dropIndex, 0, draggedImage);
			}

			// Update order
			const reordered = newImages.map((img, i) => ({
				...img,
				order: i,
			}));

			onImagesChange(reordered);
		},
		[images, onImagesChange],
	);

	return (
		<div className="space-y-4">
			{/* Drop zone */}
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`
					relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
					${isDragging ? "border-[var(--casalia-orange)] bg-[var(--casalia-orange)]/5" : "border-border hover:border-muted-foreground/50"}
					${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
				`}
			>
				<input
					type="file"
					multiple
					accept="image/jpeg,image/png,image/webp,image/gif"
					onChange={handleFileInput}
					disabled={disabled || isUploading}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
				/>

				<div className="flex flex-col items-center gap-2">
					{isUploading ? (
						<>
							<SpinnerIcon className="h-10 w-10 text-[var(--casalia-orange)] animate-spin" />
							<p className="text-sm text-muted-foreground">{uploadProgress}</p>
						</>
					) : (
						<>
							<UploadIcon className="h-10 w-10 text-muted-foreground" />
							<p className="text-sm font-medium">
								Arrastra imagenes aqui o haz clic para seleccionar
							</p>
							<p className="text-xs text-muted-foreground">
								JPG, PNG, WebP o GIF. Maximo 5MB por imagen.
							</p>
						</>
					)}
				</div>
			</div>

			{/* Image grid */}
			{images.length > 0 && (
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					{images.map((image, index) => (
						<ImageCard
							key={image.url}
							image={image}
							index={index}
							onRemove={() => handleRemoveImage(index)}
							onSetPrimary={() => handleSetPrimary(index)}
							onReorder={handleReorder}
							disabled={disabled || isUploading}
						/>
					))}
				</div>
			)}

			{/* Hidden input to store images as JSON for form submission */}
			<input type="hidden" name="images" value={JSON.stringify(images)} />
		</div>
	);
}

interface ImageCardProps {
	image: PropertyImage;
	index: number;
	onRemove: () => void;
	onSetPrimary: () => void;
	onReorder: (dragIndex: number, dropIndex: number) => void;
	disabled: boolean;
}

function ImageCard({
	image,
	index,
	onRemove,
	onSetPrimary,
	onReorder,
	disabled,
}: ImageCardProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragStart = (e: React.DragEvent) => {
		e.dataTransfer.setData("text/plain", index.toString());
		e.dataTransfer.effectAllowed = "move";
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = "move";
		setIsDragOver(true);
	};

	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"), 10);
		onReorder(dragIndex, index);
	};

	return (
		<div
			draggable={!disabled}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className={`
				relative group aspect-square rounded-lg overflow-hidden border-2 transition-all
				${isDragOver ? "border-[var(--casalia-orange)] scale-105" : "border-transparent"}
				${image.isPrimary ? "ring-2 ring-[var(--casalia-orange)]" : ""}
			`}
		>
			<Image
				src={image.url}
				alt={`Imagen ${index + 1}`}
				fill
				className="object-cover"
				sizes="(max-width: 768px) 50vw, 25vw"
			/>

			{/* Primary badge */}
			{image.isPrimary && (
				<div className="absolute top-2 left-2 bg-[var(--casalia-orange)] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
					<StarIcon weight="fill" className="h-3 w-3" />
					Principal
				</div>
			)}

			{/* Drag handle */}
			<div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
				<DragIcon className="h-4 w-4" />
			</div>

			{/* Actions overlay */}
			<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
				{!image.isPrimary && (
					<Button
						type="button"
						size="icon"
						variant="secondary"
						onClick={onSetPrimary}
						disabled={disabled}
						className="h-8 w-8"
						title="Establecer como principal"
					>
						<StarIcon className="h-4 w-4" />
					</Button>
				)}
				<Button
					type="button"
					size="icon"
					variant="destructive"
					onClick={onRemove}
					disabled={disabled}
					className="h-8 w-8"
					title="Eliminar imagen"
				>
					<DeleteIcon className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
