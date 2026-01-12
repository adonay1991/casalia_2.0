/**
 * Image processor module
 * Handles resizing, WebP conversion, and watermark application
 */

import sharp from "sharp";
import type {
	ImageProcessingConfig,
	ProcessedImage,
	WatermarkConfig,
} from "./types";
import { DEFAULT_IMAGE_CONFIG, DEFAULT_WATERMARK_CONFIG } from "./types";
import { applyWatermark, isWatermarkAvailable } from "./watermark";

/**
 * Process an image for property listings
 * - Resizes to max dimensions while maintaining aspect ratio
 * - Converts to WebP format for optimal size
 * - Optionally applies Casalia watermark
 *
 * @param inputBuffer - Raw image buffer from upload
 * @param options - Processing options
 * @returns Processed image result with buffer and metadata
 */
export async function processImage(
	inputBuffer: Buffer,
	options: {
		addWatermark?: boolean;
		imageConfig?: Partial<ImageProcessingConfig>;
		watermarkConfig?: Partial<WatermarkConfig>;
	} = {},
): Promise<ProcessedImage> {
	const {
		addWatermark = true,
		imageConfig = {},
		watermarkConfig = {},
	} = options;

	// Merge with defaults
	const config: ImageProcessingConfig = {
		...DEFAULT_IMAGE_CONFIG,
		...imageConfig,
	};

	const wmConfig: WatermarkConfig = {
		...DEFAULT_WATERMARK_CONFIG,
		...watermarkConfig,
	};

	// Step 1: Resize the image
	let processedBuffer = await sharp(inputBuffer)
		.resize(config.maxWidth, config.maxHeight, {
			fit: "inside",
			withoutEnlargement: true,
		})
		.toBuffer();

	// Step 2: Apply watermark if enabled and available
	if (addWatermark) {
		const watermarkExists = await isWatermarkAvailable(wmConfig.logoPath);
		if (watermarkExists) {
			processedBuffer = await applyWatermark(processedBuffer, wmConfig);
		}
	}

	// Step 3: Convert to WebP
	const webpBuffer = await sharp(processedBuffer)
		.webp({ quality: config.quality })
		.toBuffer();

	// Get final metadata
	const metadata = await sharp(webpBuffer).metadata();

	return {
		buffer: webpBuffer,
		width: metadata.width ?? 0,
		height: metadata.height ?? 0,
		size: webpBuffer.length,
		mimeType: "image/webp",
	};
}

/**
 * Validate if a buffer is a valid image
 */
export async function validateImage(buffer: Buffer): Promise<{
	valid: boolean;
	format?: string;
	width?: number;
	height?: number;
	error?: string;
}> {
	try {
		const metadata = await sharp(buffer).metadata();

		const supportedFormats = ["jpeg", "png", "webp", "gif", "tiff", "avif"];

		if (!metadata.format || !supportedFormats.includes(metadata.format)) {
			return {
				valid: false,
				error: `Formato no soportado: ${metadata.format ?? "desconocido"}`,
			};
		}

		return {
			valid: true,
			format: metadata.format,
			width: metadata.width,
			height: metadata.height,
		};
	} catch (error) {
		return {
			valid: false,
			error: error instanceof Error ? error.message : "Error al validar imagen",
		};
	}
}

/**
 * Get image dimensions from a buffer
 */
export async function getImageDimensions(
	buffer: Buffer,
): Promise<{ width: number; height: number } | null> {
	try {
		const metadata = await sharp(buffer).metadata();
		if (metadata.width && metadata.height) {
			return { width: metadata.width, height: metadata.height };
		}
		return null;
	} catch {
		return null;
	}
}

/**
 * Create a thumbnail from an image
 * Useful for creating smaller preview images
 */
export async function createThumbnail(
	inputBuffer: Buffer,
	options: {
		width?: number;
		height?: number;
		quality?: number;
	} = {},
): Promise<Buffer> {
	const { width = 300, height = 200, quality = 80 } = options;

	return sharp(inputBuffer)
		.resize(width, height, {
			fit: "cover",
			position: "center",
		})
		.webp({ quality })
		.toBuffer();
}
