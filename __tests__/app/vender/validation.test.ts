import { describe, expect, test } from "bun:test";
import { z } from "zod";

// Replicate the schema from the actions file for testing
// This ensures validation rules are correctly defined
const valuationSchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	email: z.string().email("Email no valido"),
	phone: z.string().min(9, "Telefono no valido"),
	propertyType: z.enum([
		"piso",
		"casa",
		"atico",
		"duplex",
		"chalet",
		"local",
		"garaje",
		"trastero",
		"otro",
	]),
	address: z.string().min(5, "La direccion es obligatoria"),
	area: z.coerce.number().min(1, "Los metros cuadrados son obligatorios"),
	bedrooms: z.coerce.number().min(0).optional(),
	bathrooms: z.coerce.number().min(0).optional(),
	condition: z
		.enum(["nueva", "buen_estado", "reformar", "para_reformar"])
		.optional(),
	additionalInfo: z.string().optional(),
});

type ValuationFormData = z.infer<typeof valuationSchema>;

const validData: ValuationFormData = {
	name: "Juan Garcia",
	email: "juan@example.com",
	phone: "612345678",
	propertyType: "piso",
	address: "Calle Mayor 123, Madrid",
	area: 85,
};

describe("Valuation Form Schema", () => {
	describe("Valid data", () => {
		test("should accept valid minimum data", () => {
			const result = valuationSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		test("should accept valid data with all optional fields", () => {
			const fullData: ValuationFormData = {
				...validData,
				bedrooms: 3,
				bathrooms: 2,
				condition: "buen_estado",
				additionalInfo: "Exterior con mucha luz",
			};
			const result = valuationSchema.safeParse(fullData);
			expect(result.success).toBe(true);
		});

		test("should coerce area from string to number", () => {
			const dataWithStringArea = {
				...validData,
				area: "100",
			};
			const result = valuationSchema.safeParse(dataWithStringArea);
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.area).toBe(100);
			}
		});
	});

	describe("Name validation", () => {
		test("should reject name shorter than 2 characters", () => {
			const result = valuationSchema.safeParse({
				...validData,
				name: "J",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"El nombre debe tener al menos 2 caracteres"
				);
			}
		});

		test("should accept name with exactly 2 characters", () => {
			const result = valuationSchema.safeParse({
				...validData,
				name: "Li",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Email validation", () => {
		test("should reject invalid email format", () => {
			const result = valuationSchema.safeParse({
				...validData,
				email: "invalid-email",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe("Email no valido");
			}
		});

		test("should reject email without domain", () => {
			const result = valuationSchema.safeParse({
				...validData,
				email: "test@",
			});
			expect(result.success).toBe(false);
		});

		test("should accept valid email formats", () => {
			const validEmails = [
				"test@example.com",
				"user.name@domain.org",
				"user+tag@subdomain.domain.es",
			];

			for (const email of validEmails) {
				const result = valuationSchema.safeParse({
					...validData,
					email,
				});
				expect(result.success).toBe(true);
			}
		});
	});

	describe("Phone validation", () => {
		test("should reject phone shorter than 9 characters", () => {
			const result = valuationSchema.safeParse({
				...validData,
				phone: "12345678",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe("Telefono no valido");
			}
		});

		test("should accept phone with exactly 9 characters", () => {
			const result = valuationSchema.safeParse({
				...validData,
				phone: "612345678",
			});
			expect(result.success).toBe(true);
		});

		test("should accept phone with country code", () => {
			const result = valuationSchema.safeParse({
				...validData,
				phone: "+34612345678",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Property type validation", () => {
		test("should accept all valid property types", () => {
			const validTypes = [
				"piso",
				"casa",
				"atico",
				"duplex",
				"chalet",
				"local",
				"garaje",
				"trastero",
				"otro",
			];

			for (const propertyType of validTypes) {
				const result = valuationSchema.safeParse({
					...validData,
					propertyType,
				});
				expect(result.success).toBe(true);
			}
		});

		test("should reject invalid property type", () => {
			const result = valuationSchema.safeParse({
				...validData,
				propertyType: "castillo",
			});
			expect(result.success).toBe(false);
		});
	});

	describe("Address validation", () => {
		test("should reject address shorter than 5 characters", () => {
			const result = valuationSchema.safeParse({
				...validData,
				address: "C/1",
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"La direccion es obligatoria"
				);
			}
		});

		test("should accept address with exactly 5 characters", () => {
			const result = valuationSchema.safeParse({
				...validData,
				address: "C/ 1a",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Area validation", () => {
		test("should reject area of 0", () => {
			const result = valuationSchema.safeParse({
				...validData,
				area: 0,
			});
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0]?.message).toBe(
					"Los metros cuadrados son obligatorios"
				);
			}
		});

		test("should reject negative area", () => {
			const result = valuationSchema.safeParse({
				...validData,
				area: -50,
			});
			expect(result.success).toBe(false);
		});

		test("should accept decimal area", () => {
			const result = valuationSchema.safeParse({
				...validData,
				area: 85.5,
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Optional fields", () => {
		test("should accept bedrooms as 0", () => {
			const result = valuationSchema.safeParse({
				...validData,
				bedrooms: 0,
			});
			expect(result.success).toBe(true);
		});

		test("should reject negative bedrooms", () => {
			const result = valuationSchema.safeParse({
				...validData,
				bedrooms: -1,
			});
			expect(result.success).toBe(false);
		});

		test("should accept all valid conditions", () => {
			const validConditions = [
				"nueva",
				"buen_estado",
				"reformar",
				"para_reformar",
			];

			for (const condition of validConditions) {
				const result = valuationSchema.safeParse({
					...validData,
					condition,
				});
				expect(result.success).toBe(true);
			}
		});

		test("should accept empty additionalInfo", () => {
			const result = valuationSchema.safeParse({
				...validData,
				additionalInfo: "",
			});
			expect(result.success).toBe(true);
		});
	});

	describe("Missing required fields", () => {
		test("should reject missing name", () => {
			const { name, ...dataWithoutName } = validData;
			const result = valuationSchema.safeParse(dataWithoutName);
			expect(result.success).toBe(false);
		});

		test("should reject missing email", () => {
			const { email, ...dataWithoutEmail } = validData;
			const result = valuationSchema.safeParse(dataWithoutEmail);
			expect(result.success).toBe(false);
		});

		test("should reject missing phone", () => {
			const { phone, ...dataWithoutPhone } = validData;
			const result = valuationSchema.safeParse(dataWithoutPhone);
			expect(result.success).toBe(false);
		});

		test("should reject missing propertyType", () => {
			const { propertyType, ...dataWithoutType } = validData;
			const result = valuationSchema.safeParse(dataWithoutType);
			expect(result.success).toBe(false);
		});

		test("should reject missing address", () => {
			const { address, ...dataWithoutAddress } = validData;
			const result = valuationSchema.safeParse(dataWithoutAddress);
			expect(result.success).toBe(false);
		});

		test("should reject missing area", () => {
			const { area, ...dataWithoutArea } = validData;
			const result = valuationSchema.safeParse(dataWithoutArea);
			expect(result.success).toBe(false);
		});
	});
});
