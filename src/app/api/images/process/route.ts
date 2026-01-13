/**
 * API Route: Image Processing
 * Handles image upload, WebP conversion, watermark application, and storage
 */

import { NextResponse } from "next/server";

import { processImage, validateImage } from "@/lib/images";
import type { ImageUploadResult } from "@/lib/images";
import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "property-images";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * POST /api/images/process
 * Processes an image and uploads it to Supabase Storage
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
		const supabase = await createClient();

		const {
			data: { user },
			error: authError,
		} = await supabase.auth.getUser();

		if (authError || !user) {
			return NextResponse.json(
				{ success: false, error: "No autorizado" },
				{ status: 401 },
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File | null;
		const propertyId = formData.get("propertyId") as string | null;
		const addWatermarkStr = formData.get("addWatermark") as string | null;

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

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{
					success: false,
					error: "El archivo excede el tamanio maximo de 10MB",
				},
				{ status: 400 },
			);
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const validation = await validateImage(buffer);
		if (!validation.valid) {
			return NextResponse.json(
				{ success: false, error: validation.error ?? "Imagen no valida" },
				{ status: 400 },
			);
		}

		const addWatermark = addWatermarkStr !== "false";
		const processed = await processImage(buffer, { addWatermark });

		const timestamp = Date.now();
		const random = Math.random().toString(36).substring(2, 9);
		const fileName = `${propertyId}/${timestamp}-${random}.webp`;

		const { data, error: uploadError } = await supabase.storage
			.from(BUCKET_NAME)
			.upload(fileName, processed.buffer, {
				contentType: "image/webp",
				cacheControl: "31536000",
				upsert: false,
			});

		if (uploadError) {
			console.error("Storage upload error:", uploadError);
			return NextResponse.json(
				{
					success: false,
					error: `Error al subir imagen: ${uploadError.message}`,
				},
				{ status: 500 },
			);
		}

		const {
			data: { publicUrl },
		} = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

		return NextResponse.json({
			success: true,
			url: publicUrl,
			path: data.path,
			width: processed.width,
			height: processed.height,
			size: processed.size,
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
