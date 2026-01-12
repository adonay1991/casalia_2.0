/**
 * Image processing types for Casalia 2.0
 * Used for WebP conversion and watermark application
 */

/**
 * Configuration for image processing
 */
export interface ImageProcessingConfig {
	/** Maximum width in pixels (maintains aspect ratio) */
	maxWidth: number;
	/** Maximum height in pixels (maintains aspect ratio) */
	maxHeight: number;
	/** WebP quality (0-100) */
	quality: number;
}

/**
 * Configuration for watermark application
 */
export interface WatermarkConfig {
	/** Path to the watermark image file */
	logoPath: string;
	/** Size as percentage of image width (0-100) */
	sizePercent: number;
	/** Opacity (0-1) */
	opacity: number;
	/** Position on the image */
	position: WatermarkPosition;
	/** Margin from edges in pixels */
	margin: number;
}

/**
 * Supported watermark positions
 */
export type WatermarkPosition =
	| "northwest"
	| "north"
	| "northeast"
	| "west"
	| "center"
	| "east"
	| "southwest"
	| "south"
	| "southeast";

/**
 * Result of image processing
 */
export interface ProcessedImage {
	/** Processed image as Buffer */
	buffer: Buffer;
	/** Final width in pixels */
	width: number;
	/** Final height in pixels */
	height: number;
	/** File size in bytes */
	size: number;
	/** MIME type (always image/webp) */
	mimeType: "image/webp";
}

/**
 * Result of image upload operation
 */
export interface ImageUploadResult {
	success: boolean;
	url?: string;
	path?: string;
	width?: number;
	height?: number;
	size?: number;
	error?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_IMAGE_CONFIG: ImageProcessingConfig = {
	maxWidth: 1920,
	maxHeight: 1440,
	quality: 85,
};

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
	logoPath: "public/watermarks/casalia-logo.png",
	sizePercent: 15,
	opacity: 0.3,
	position: "southeast",
	margin: 20,
};
