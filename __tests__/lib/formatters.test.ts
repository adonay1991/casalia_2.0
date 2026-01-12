import { describe, expect, test } from "bun:test";
import {
	formatDate,
	formatPhone,
	formatPrice,
	formatSquareMeters,
	getEnergyCertificateColor,
	getLeadSourceLabel,
	getLeadStatusLabel,
	getOperationTypeLabel,
	getPropertyStatusBadgeVariant,
	getPropertyStatusLabel,
	getPropertyTypeLabel,
	slugify,
	truncate,
} from "@/lib/formatters";

// Non-breaking space used by Intl.NumberFormat for EUR formatting
const NBSP = "\u00A0";

describe("Formatters", () => {
	describe("formatPrice", () => {
		test("should format number as EUR currency", () => {
			expect(formatPrice(150000)).toBe(`150.000${NBSP}€`);
		});

		test("should format string price as EUR currency", () => {
			expect(formatPrice("250000")).toBe(`250.000${NBSP}€`);
		});

		test("should add /mes suffix for alquiler", () => {
			expect(formatPrice(800, "alquiler")).toBe(`800${NBSP}€/mes`);
		});

		test("should not add suffix for venta", () => {
			expect(formatPrice(150000, "venta")).toBe(`150.000${NBSP}€`);
		});

		test("should handle decimal prices", () => {
			expect(formatPrice(150000.5)).toBe(`150.001${NBSP}€`);
		});

		test("should handle zero", () => {
			expect(formatPrice(0)).toBe(`0${NBSP}€`);
		});

		test("should handle NaN", () => {
			expect(formatPrice("invalid")).toBe("Precio no disponible");
		});

		test("should handle negative prices", () => {
			// Spanish locale doesn't add thousand separator for numbers < 10000
			expect(formatPrice(-1000)).toBe(`-1000${NBSP}€`);
		});
	});

	describe("formatDate", () => {
		test("should format Date object in Spanish", () => {
			const date = new Date("2024-03-15");
			expect(formatDate(date)).toBe("15 de marzo de 2024");
		});

		test("should format ISO string", () => {
			expect(formatDate("2024-12-25")).toBe("25 de diciembre de 2024");
		});

		test("should return empty string for null", () => {
			expect(formatDate(null)).toBe("");
		});

		test("should return empty string for invalid date", () => {
			expect(formatDate("invalid-date")).toBe("");
		});

		test("should format in short style", () => {
			const date = new Date("2024-03-15");
			const result = formatDate(date, { style: "short" });
			expect(result).toMatch(/15\/03\/2024/);
		});

		test("should format in medium style", () => {
			const date = new Date("2024-03-15");
			const result = formatDate(date, { style: "medium" });
			expect(result).toContain("2024");
		});

		test("should include time when requested", () => {
			const date = new Date("2024-03-15T14:30:00");
			const result = formatDate(date, { includeTime: true });
			expect(result).toContain("14:30");
		});
	});

	describe("getEnergyCertificateColor", () => {
		test("should return green-500 for A rating", () => {
			expect(getEnergyCertificateColor("A")).toBe("bg-green-500");
		});

		test("should return green-400 for B rating", () => {
			expect(getEnergyCertificateColor("B")).toBe("bg-green-400");
		});

		test("should return lime-400 for C rating", () => {
			expect(getEnergyCertificateColor("C")).toBe("bg-lime-400");
		});

		test("should return yellow-400 for D rating", () => {
			expect(getEnergyCertificateColor("D")).toBe("bg-yellow-400");
		});

		test("should return orange-400 for E rating", () => {
			expect(getEnergyCertificateColor("E")).toBe("bg-orange-400");
		});

		test("should return orange-500 for F rating", () => {
			expect(getEnergyCertificateColor("F")).toBe("bg-orange-500");
		});

		test("should return red-500 for G rating", () => {
			expect(getEnergyCertificateColor("G")).toBe("bg-red-500");
		});

		test("should return gray-400 for en_tramite", () => {
			expect(getEnergyCertificateColor("en_tramite")).toBe("bg-gray-400");
		});

		test("should return gray-400 for exento", () => {
			expect(getEnergyCertificateColor("exento")).toBe("bg-gray-400");
		});

		test("should return gray-400 for unknown value", () => {
			expect(getEnergyCertificateColor("unknown")).toBe("bg-gray-400");
		});
	});

	describe("getPropertyTypeLabel", () => {
		test("should return Piso for piso", () => {
			expect(getPropertyTypeLabel("piso")).toBe("Piso");
		});

		test("should return Casa for casa", () => {
			expect(getPropertyTypeLabel("casa")).toBe("Casa");
		});

		test("should return Terreno for terreno", () => {
			expect(getPropertyTypeLabel("terreno")).toBe("Terreno");
		});

		test("should return Local for local", () => {
			expect(getPropertyTypeLabel("local")).toBe("Local");
		});

		test("should return Garaje for garaje", () => {
			expect(getPropertyTypeLabel("garaje")).toBe("Garaje");
		});

		test("should return Trastero for trastero", () => {
			expect(getPropertyTypeLabel("trastero")).toBe("Trastero");
		});

		test("should return input for unknown type", () => {
			expect(getPropertyTypeLabel("custom")).toBe("custom");
		});
	});

	describe("getOperationTypeLabel", () => {
		test("should return Venta for venta", () => {
			expect(getOperationTypeLabel("venta")).toBe("Venta");
		});

		test("should return Alquiler for alquiler", () => {
			expect(getOperationTypeLabel("alquiler")).toBe("Alquiler");
		});

		test("should return input for unknown type", () => {
			expect(getOperationTypeLabel("custom")).toBe("custom");
		});
	});

	describe("getPropertyStatusLabel", () => {
		test("should return Disponible for disponible", () => {
			expect(getPropertyStatusLabel("disponible")).toBe("Disponible");
		});

		test("should return Reservado for reservado", () => {
			expect(getPropertyStatusLabel("reservado")).toBe("Reservado");
		});

		test("should return Vendido for vendido", () => {
			expect(getPropertyStatusLabel("vendido")).toBe("Vendido");
		});

		test("should return Alquilado for alquilado", () => {
			expect(getPropertyStatusLabel("alquilado")).toBe("Alquilado");
		});
	});

	describe("getPropertyStatusBadgeVariant", () => {
		test("should return null for disponible", () => {
			expect(getPropertyStatusBadgeVariant("disponible")).toBeNull();
		});

		test("should return secondary for reservado", () => {
			expect(getPropertyStatusBadgeVariant("reservado")).toBe("secondary");
		});

		test("should return destructive for vendido", () => {
			expect(getPropertyStatusBadgeVariant("vendido")).toBe("destructive");
		});

		test("should return destructive for alquilado", () => {
			expect(getPropertyStatusBadgeVariant("alquilado")).toBe("destructive");
		});

		test("should return null for unknown status", () => {
			expect(getPropertyStatusBadgeVariant("unknown")).toBeNull();
		});
	});

	describe("getLeadStatusLabel", () => {
		test("should return Nuevo for nuevo", () => {
			expect(getLeadStatusLabel("nuevo")).toBe("Nuevo");
		});

		test("should return Contactado for contactado", () => {
			expect(getLeadStatusLabel("contactado")).toBe("Contactado");
		});

		test("should return Visita Programada for visita", () => {
			expect(getLeadStatusLabel("visita")).toBe("Visita Programada");
		});

		test("should return Cerrado for cerrado", () => {
			expect(getLeadStatusLabel("cerrado")).toBe("Cerrado");
		});

		test("should return Descartado for descartado", () => {
			expect(getLeadStatusLabel("descartado")).toBe("Descartado");
		});
	});

	describe("getLeadSourceLabel", () => {
		test("should return Web for web", () => {
			expect(getLeadSourceLabel("web")).toBe("Web");
		});

		test("should return Idealista for idealista", () => {
			expect(getLeadSourceLabel("idealista")).toBe("Idealista");
		});

		test("should return Fotocasa for fotocasa", () => {
			expect(getLeadSourceLabel("fotocasa")).toBe("Fotocasa");
		});

		test("should return WhatsApp for whatsapp", () => {
			expect(getLeadSourceLabel("whatsapp")).toBe("WhatsApp");
		});

		test("should return Valoracion for valoracion", () => {
			expect(getLeadSourceLabel("valoracion")).toBe("Valoracion");
		});
	});

	describe("slugify", () => {
		test("should convert to lowercase", () => {
			expect(slugify("Hello World")).toBe("hello-world");
		});

		test("should replace spaces with hyphens", () => {
			expect(slugify("hello world test")).toBe("hello-world-test");
		});

		test("should remove accents", () => {
			expect(slugify("Piso en Parla")).toBe("piso-en-parla");
			expect(slugify("Atico duplex")).toBe("atico-duplex");
		});

		test("should remove special characters", () => {
			expect(slugify("Hello! @World#")).toBe("hello-world");
		});

		test("should handle multiple hyphens", () => {
			expect(slugify("hello   world")).toBe("hello-world");
		});

		test("should remove leading and trailing hyphens", () => {
			expect(slugify(" hello world ")).toBe("hello-world");
		});

		test("should handle Spanish text", () => {
			expect(slugify("Piso reformado en zona centro")).toBe(
				"piso-reformado-en-zona-centro"
			);
		});

		test("should handle empty string", () => {
			expect(slugify("")).toBe("");
		});
	});

	describe("truncate", () => {
		test("should not truncate short text", () => {
			expect(truncate("Hello", 10)).toBe("Hello");
		});

		test("should truncate long text with ellipsis", () => {
			expect(truncate("Hello World", 8)).toBe("Hello...");
		});

		test("should handle exact length", () => {
			expect(truncate("Hello", 5)).toBe("Hello");
		});

		test("should handle very short maxLength", () => {
			expect(truncate("Hello", 4)).toBe("H...");
		});

		test("should handle empty string", () => {
			expect(truncate("", 10)).toBe("");
		});
	});

	describe("formatSquareMeters", () => {
		test("should format with m² unit", () => {
			expect(formatSquareMeters(100)).toBe("100 m²");
		});

		test("should return empty string for null", () => {
			expect(formatSquareMeters(null)).toBe("");
		});

		test("should return empty string for undefined", () => {
			expect(formatSquareMeters(undefined)).toBe("");
		});

		test("should handle zero", () => {
			expect(formatSquareMeters(0)).toBe("0 m²");
		});

		test("should handle large numbers", () => {
			expect(formatSquareMeters(1500)).toBe("1500 m²");
		});
	});

	describe("formatPhone", () => {
		test("should format 9-digit Spanish mobile", () => {
			expect(formatPhone("612345678")).toBe("612 345 678");
		});

		test("should format with country code", () => {
			expect(formatPhone("34612345678")).toBe("+34 612 345 678");
		});

		test("should handle already formatted phone", () => {
			const phone = "612 345 678";
			expect(formatPhone(phone)).toBe("612 345 678");
		});

		test("should return original for unknown format", () => {
			expect(formatPhone("12345")).toBe("12345");
		});

		test("should handle phone with dashes", () => {
			expect(formatPhone("612-345-678")).toBe("612 345 678");
		});
	});
});
