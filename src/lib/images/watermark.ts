/**
 * Watermark application module
 * Applies Casalia logo as watermark to property images
 */

import path from "node:path";
import sharp from "sharp";
import type { WatermarkConfig, WatermarkPosition } from "./types";
import { DEFAULT_WATERMARK_CONFIG } from "./types";

/**
 * Convert position string to Sharp gravity value
 */
function positionToGravity(
	position: WatermarkPosition,
): "northwest" | "north" | "northeast" | "west" | "center" | "east" | "southwest" | "south" | "southeast" {
	// Sharp uses the same position names
	return position;
}

/**
 * Create a watermark overlay with the specified configuration
 * Returns the watermark buffer ready to be composited
 */
async function createWatermarkOverlay(
	targetWidth: number,
	config: WatermarkConfig,
): Promise<Buffer | null> {
	const logoFullPath = path.join(process.cwd(), config.logoPath);

	try {
		// Read the logo file
		const logoBuffer = await sharp(logoFullPath).toBuffer();
		const logoMetadata = await sharp(logoBuffer).metadata();

		if (!logoMetadata.width || !logoMetadata.height) {
			console.warn("Could not read watermark logo dimensions");
			return null;
		}

		// Calculate watermark size based on target image width
		const watermarkWidth = Math.round(
			(targetWidth * config.sizePercent) / 100,
		);
		const aspectRatio = logoMetadata.height / logoMetadata.width;
		const watermarkHeight = Math.round(watermarkWidth * aspectRatio);

		// Resize and apply opacity to the logo
		const resizedLogo = await sharp(logoBuffer)
			.resize(watermarkWidth, watermarkHeight, {
				fit: "contain",
			})
			.ensureAlpha() // Ensure alpha channel exists
			.composite([
				{
					// Apply opacity using a semi-transparent overlay
					input: Buffer.from([
						0,
						0,
						0,
						Math.round(255 * config.opacity),
					]),
					raw: { width: 1, height: 1, channels: 4 },
					tile: true,
					blend: "dest-in",
				},
			])
			.png() // Keep as PNG for compositing (preserves transparency)
			.toBuffer();

		return resizedLogo;
	} catch (error) {
		// If watermark file doesn't exist or can't be read, log and continue
		console.warn(
			"Watermark logo not available, processing without watermark:",
			error,
		);
		return null;
	}
}

/**
 * Apply watermark to an image
 * @param imageBuffer - The source image buffer
 * @param config - Watermark configuration (optional, uses defaults)
 * @returns Sharp instance with watermark applied, or original if watermark unavailable
 */
export async function applyWatermark(
	imageBuffer: Buffer,
	config: WatermarkConfig = DEFAULT_WATERMARK_CONFIG,
): Promise<Buffer> {
	// Get image dimensions
	const metadata = await sharp(imageBuffer).metadata();

	if (!metadata.width || !metadata.height) {
		// Can't apply watermark without dimensions, return original
		return imageBuffer;
	}

	// Create watermark overlay
	const watermarkOverlay = await createWatermarkOverlay(
		metadata.width,
		config,
	);

	if (!watermarkOverlay) {
		// Watermark not available, return original
		return imageBuffer;
	}

	// Get watermark dimensions for margin calculation
	const watermarkMeta = await sharp(watermarkOverlay).metadata();
	const wmWidth = watermarkMeta.width ?? 100;
	const wmHeight = watermarkMeta.height ?? 100;

	// Calculate position with margin
	const gravity = positionToGravity(config.position);

	// For positioned compositing, we need to calculate exact x/y
	let left: number;
	let top: number;

	switch (gravity) {
		case "northwest":
			left = config.margin;
			top = config.margin;
			break;
		case "north":
			left = Math.round((metadata.width - wmWidth) / 2);
			top = config.margin;
			break;
		case "northeast":
			left = metadata.width - wmWidth - config.margin;
			top = config.margin;
			break;
		case "west":
			left = config.margin;
			top = Math.round((metadata.height - wmHeight) / 2);
			break;
		case "center":
			left = Math.round((metadata.width - wmWidth) / 2);
			top = Math.round((metadata.height - wmHeight) / 2);
			break;
		case "east":
			left = metadata.width - wmWidth - config.margin;
			top = Math.round((metadata.height - wmHeight) / 2);
			break;
		case "southwest":
			left = config.margin;
			top = metadata.height - wmHeight - config.margin;
			break;
		case "south":
			left = Math.round((metadata.width - wmWidth) / 2);
			top = metadata.height - wmHeight - config.margin;
			break;
		case "southeast":
		default:
			left = metadata.width - wmWidth - config.margin;
			top = metadata.height - wmHeight - config.margin;
			break;
	}

	// Ensure positions are valid
	left = Math.max(0, left);
	top = Math.max(0, top);

	// Apply watermark
	const result = await sharp(imageBuffer)
		.composite([
			{
				input: watermarkOverlay,
				left,
				top,
			},
		])
		.toBuffer();

	return result;
}

/**
 * Check if watermark logo file exists
 */
export async function isWatermarkAvailable(
	logoPath: string = DEFAULT_WATERMARK_CONFIG.logoPath,
): Promise<boolean> {
	const fullPath = path.join(process.cwd(), logoPath);

	try {
		await sharp(fullPath).metadata();
		return true;
	} catch {
		return false;
	}
}
