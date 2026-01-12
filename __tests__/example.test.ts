import { describe, expect, test } from "bun:test";
import { cn } from "@/lib/utils";

describe("Utils", () => {
	describe("cn (className merger)", () => {
		test("should merge class names correctly", () => {
			const result = cn("px-4", "py-2", "bg-zinc-900");
			expect(result).toBe("px-4 py-2 bg-zinc-900");
		});

		test("should handle conflicting Tailwind classes", () => {
			const result = cn("px-4", "px-8");
			expect(result).toBe("px-8");
		});

		test("should handle conditional classes", () => {
			const isActive = true;
			const result = cn("base-class", isActive && "active-class");
			expect(result).toBe("base-class active-class");
		});

		test("should filter out falsy values", () => {
			const result = cn("base", false, null, undefined, "valid");
			expect(result).toBe("base valid");
		});
	});
});

describe("Project Setup", () => {
	test("should have correct Node environment", () => {
		expect(process.env.NODE_ENV).toBeDefined();
	});
});
