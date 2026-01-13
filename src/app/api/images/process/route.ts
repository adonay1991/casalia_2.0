/**
 * API Route: Image Processing
 * TODO: Re-implement after Supabase reconnection
 * Handles image upload, WebP conversion, watermark application, and storage
 */

import { NextResponse } from "next/server";

import { processImage, validateImage } from "@/lib/images";
import type { ImageUploadResult } from "@/lib/images";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/images/process
 * Processes an image - TODO: Re-implement storage after Supabase reconnection
 *
 * Body: FormData
 * - file: Image file (required)
 * - propertyId: Property ID for storage path (required)
 * - addWatermark: Whether to add watermark (optional, default: true)
 */
export async function POST(
	request: Request,
): Promise<NextResponse<ImageUploadResult>> {
	try {
		// TODO: Implement authentication check after Supabase reconnection
		// For now, process images without auth

		// Parse the form data
		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const propertyId = formData.get("propertyId") as string | null;
		const addWatermarkStr = formData.get("addWatermark") as string | null;

		// Validate required fields
		if (!file) {
			return NextResponse.json(
				{ success: false, error: "No se proporciono archivo" },
				{ status: 400 },
			);
		}

		if (!propertyId) {
			return NextResponse.json(
				{ success: false, error: "No se proporciono propertyId" },
				{ status: 400 },
			);
		}

		// Check file size
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{
					success: false,
					error: "El archivo excede el tamanio maximo de 10MB",
				},
				{ status: 400 },
			);
		}

		// Convert file to buffer
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		// Validate image
		const validation = await validateImage(buffer);
		if (!validation.valid) {
			return NextResponse.json(
				{ success: false, error: validation.error ?? "Imagen no valida" },
				{ status: 400 },
			);
		}

		// Process the image (resize, watermark, convert to WebP)
		const addWatermark = addWatermarkStr !== "false";
		const processed = await processImage(buffer, { addWatermark });

		// TODO: Upload to Supabase Storage after reconnection
		// For now, return a placeholder response
		return NextResponse.json({
			success: false,
			error:
				"Almacenamiento no disponible. TODO: Re-implementar conexion con Supabase Storage",
		});
	} catch (error) {
		console.error("Image processing error:", error);
		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Error desconocido al procesar imagen",
			},
			{ status: 500 },
		);
	}
}
