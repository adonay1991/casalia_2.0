/**
 * Image processing module exports
 */

export {
	processImage,
	validateImage,
	getImageDimensions,
	createThumbnail,
} from "./processor";

export { applyWatermark, isWatermarkAvailable } from "./watermark";

export type {
	ImageProcessingConfig,
	WatermarkConfig,
	WatermarkPosition,
	ProcessedImage,
	ImageUploadResult,
} from "./types";

export {
	DEFAULT_IMAGE_CONFIG,
	DEFAULT_WATERMARK_CONFIG,
} from "./types";
