/**
 * Supabase Storage utilities for file uploads
 */

import { createClient } from "./client";

const BUCKET_NAME = "property-images";

interface UploadResult {
	success: boolean;
	url?: string;
	path?: string;
	error?: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadPropertyImage(
	file: File,
	propertyId: string,
): Promise<UploadResult> {
	const supabase = createClient();

	// Generate unique filename
	const fileExt = file.name.split(".").pop();
	const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

	const { data, error } = await supabase.storage
		.from(BUCKET_NAME)
		.upload(fileName, file, {
			cacheControl: "3600",
			upsert: false,
		});

	if (error) {
		console.error("Storage upload error:", error);
		return { success: false, error: error.message };
	}

	// Get public URL
	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

	return {
		success: true,
		url: publicUrl,
		path: data.path,
	};
}

/**
 * Delete a file from Supabase Storage
 */
export async function deletePropertyImage(path: string): Promise<boolean> {
	const supabase = createClient();

	const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

	if (error) {
		console.error("Storage delete error:", error);
		return false;
	}

	return true;
}

/**
 * Extract storage path from full URL
 */
export function getPathFromUrl(url: string): string | null {
	const match = url.match(/property-images\/(.+)$/);
	return match ? match[1] : null;
}
