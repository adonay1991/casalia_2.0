import { describe, expect, test } from "bun:test";
import { getPathFromUrl } from "@/lib/supabase/storage";

describe("Storage Utilities", () => {
	describe("getPathFromUrl", () => {
		test("should extract path from full Supabase storage URL", () => {
			const url =
				"https://abc.supabase.co/storage/v1/object/public/property-images/prop-123/image.jpg";
			expect(getPathFromUrl(url)).toBe("prop-123/image.jpg");
		});

		test("should handle paths with multiple segments", () => {
			const url =
				"https://abc.supabase.co/storage/v1/object/public/property-images/2024/01/15/image.webp";
			expect(getPathFromUrl(url)).toBe("2024/01/15/image.webp");
		});

		test("should handle paths with special characters", () => {
			const url =
				"https://abc.supabase.co/storage/v1/object/public/property-images/prop-123/image-file_v2.jpg";
			expect(getPathFromUrl(url)).toBe("prop-123/image-file_v2.jpg");
		});

		test("should return null for URLs without property-images bucket", () => {
			const url = "https://example.com/other-bucket/image.jpg";
			expect(getPathFromUrl(url)).toBeNull();
		});

		test("should return null for malformed URLs", () => {
			expect(getPathFromUrl("not-a-url")).toBeNull();
		});

		test("should return null for empty string", () => {
			expect(getPathFromUrl("")).toBeNull();
		});
	});
});
