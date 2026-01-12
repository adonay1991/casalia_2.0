"use client";

import {
	CaretLeft as ChevronLeftIcon,
	CaretRight as ChevronRightIcon,
	ArrowsOutSimple as ExpandIcon,
	X as XIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { MOTION_DURATIONS, MOTION_EASINGS } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PropertyImage } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
	images: PropertyImage[];
	title: string;
	isHighlighted?: boolean;
	status?: "disponible" | "reservado" | "vendido" | "alquilado";
}

export function PropertyGallery({
	images,
	title,
	isHighlighted,
	status,
}: PropertyGalleryProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isLightboxOpen, setIsLightboxOpen] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	const hasMultipleImages = images.length > 1;

	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	}, [images.length]);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	}, [images.length]);

	const openLightbox = (index?: number) => {
		if (index !== undefined) {
			setCurrentIndex(index);
		}
		setIsLightboxOpen(true);
	};

	const closeLightbox = () => {
		setIsLightboxOpen(false);
	};

	// Handle keyboard navigation
	useEffect(() => {
		if (!isLightboxOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case "ArrowLeft":
					goToPrevious();
					break;
				case "ArrowRight":
					goToNext();
					break;
				case "Escape":
					closeLightbox();
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		// Prevent body scroll when lightbox is open
		document.body.style.overflow = "hidden";

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "unset";
		};
	}, [isLightboxOpen, goToNext, goToPrevious]);

	const currentImage = images[currentIndex];

	if (images.length === 0) {
		return (
			<div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-200">
				<div className="absolute inset-0 flex items-center justify-center text-zinc-400">
					Sin imagen
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-4">
				{/* Main Image */}
				<div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-200 group">
					<Image
						src={currentImage?.url ?? ""}
						alt={`${title} - Imagen ${currentIndex + 1}`}
						fill
						className="object-cover cursor-pointer"
						priority
						onClick={() => openLightbox()}
						sizes="(max-width: 768px) 100vw, 66vw"
					/>

					{/* Badges */}
					<div className="absolute top-4 left-4 flex gap-2">
						{isHighlighted && (
							<Badge className="bg-[var(--casalia-orange)]">Destacado</Badge>
						)}
						{status === "reservado" && (
							<Badge variant="secondary">Reservado</Badge>
						)}
						{status === "vendido" && (
							<Badge variant="destructive">Vendido</Badge>
						)}
						{status === "alquilado" && (
							<Badge variant="secondary">Alquilado</Badge>
						)}
					</div>

					{/* Expand button */}
					<button
						type="button"
						onClick={() => openLightbox()}
						className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
						title="Ver en pantalla completa"
					>
						<ExpandIcon className="h-5 w-5" />
					</button>

					{/* Navigation arrows */}
					{hasMultipleImages && (
						<>
							<button
								type="button"
								onClick={goToPrevious}
								className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
								title="Imagen anterior"
							>
								<ChevronLeftIcon className="h-5 w-5" />
							</button>
							<button
								type="button"
								onClick={goToNext}
								className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
								title="Imagen siguiente"
							>
								<ChevronRightIcon className="h-5 w-5" />
							</button>
						</>
					)}

					{/* Image counter */}
					{hasMultipleImages && (
						<div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
							{currentIndex + 1} / {images.length}
						</div>
					)}
				</div>

				{/* Thumbnail Gallery */}
				{images.length > 1 && (
					<div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
						{images.map((image, index) => (
							<button
								key={image.id}
								type="button"
								onClick={() => setCurrentIndex(index)}
								className={cn(
									"relative aspect-video rounded-md overflow-hidden bg-zinc-200",
									"ring-2 ring-offset-2 transition-all",
									index === currentIndex
										? "ring-[var(--casalia-orange)]"
										: "ring-transparent hover:ring-zinc-300",
								)}
							>
								<Image
									src={image.url}
									alt={`${title} - Miniatura ${index + 1}`}
									fill
									className="object-cover"
									sizes="(max-width: 768px) 25vw, 10vw"
								/>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Lightbox Modal */}
			<AnimatePresence>
				{isLightboxOpen && (
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: MOTION_DURATIONS.fast,
							ease: MOTION_EASINGS.smooth,
						}}
						className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
						onClick={closeLightbox}
					>
					{/* Close button */}
					<Button
						variant="ghost"
						size="icon"
						onClick={closeLightbox}
						className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
					>
						<XIcon className="h-6 w-6" />
					</Button>

					{/* Image counter */}
					<div className="absolute top-4 left-4 text-white text-sm z-10">
						{currentIndex + 1} / {images.length}
					</div>

					{/* Navigation buttons */}
					{hasMultipleImages && (
						<>
							<Button
								variant="ghost"
								size="icon"
								onClick={(e) => {
									e.stopPropagation();
									goToPrevious();
								}}
								className="absolute left-4 text-white hover:bg-white/10 z-10"
							>
								<ChevronLeftIcon className="h-8 w-8" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={(e) => {
									e.stopPropagation();
									goToNext();
								}}
								className="absolute right-4 text-white hover:bg-white/10 z-10"
							>
								<ChevronRightIcon className="h-8 w-8" />
							</Button>
						</>
					)}

					{/* Main image */}
					<div
						className="relative w-full h-full max-w-[90vw] max-h-[90vh]"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={currentImage?.url ?? ""}
							alt={`${title} - Imagen ${currentIndex + 1}`}
							fill
							className="object-contain"
							sizes="90vw"
						/>
					</div>

					{/* Thumbnails at bottom */}
					{images.length > 1 && (
						<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2">
							{images.map((image, index) => (
								<button
									key={image.id}
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setCurrentIndex(index);
									}}
									className={cn(
										"relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0",
										"ring-2 ring-offset-2 ring-offset-black transition-all",
										index === currentIndex
											? "ring-[var(--casalia-orange)]"
											: "ring-transparent hover:ring-white/50 opacity-60 hover:opacity-100",
									)}
								>
									<Image
										src={image.url}
										alt={`Miniatura ${index + 1}`}
										fill
										className="object-cover"
										sizes="64px"
									/>
								</button>
							))}
						</div>
					)}
				</motion.div>
			)}
			</AnimatePresence>
		</>
	);
}
