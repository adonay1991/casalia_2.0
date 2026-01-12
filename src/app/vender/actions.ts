"use server";

import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const valuationSchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	email: z.string().email("Email no valido"),
	phone: z.string().min(9, "Telefono no valido"),
	propertyType: z.enum(["piso", "casa", "atico", "duplex", "chalet", "local", "garaje", "trastero", "otro"]),
	address: z.string().min(5, "La direccion es obligatoria"),
	area: z.coerce.number().min(1, "Los metros cuadrados son obligatorios"),
	bedrooms: z.coerce.number().min(0).optional(),
	bathrooms: z.coerce.number().min(0).optional(),
	condition: z.enum(["nueva", "buen_estado", "reformar", "para_reformar"]).optional(),
	additionalInfo: z.string().optional(),
});

export type ValuationFormData = z.infer<typeof valuationSchema>;

interface ActionResult {
	success: boolean;
	error?: string;
}

export async function submitValuationRequest(
	formData: ValuationFormData
): Promise<ActionResult> {
	try {
		const validated = valuationSchema.parse(formData);

		// Build the message with property details
		const propertyDetails = [
			`Tipo: ${validated.propertyType}`,
			`Direccion: ${validated.address}`,
			`Metros cuadrados: ${validated.area}m2`,
			validated.bedrooms ? `Habitaciones: ${validated.bedrooms}` : null,
			validated.bathrooms ? `Banos: ${validated.bathrooms}` : null,
			validated.condition ? `Estado: ${validated.condition.replace("_", " ")}` : null,
			validated.additionalInfo ? `\nInformacion adicional: ${validated.additionalInfo}` : null,
		]
			.filter(Boolean)
			.join("\n");

		const message = `SOLICITUD DE VALORACION\n\n${propertyDetails}`;

		await db.insert(leads).values({
			name: validated.name,
			email: validated.email,
			phone: validated.phone,
			message,
			source: "valoracion",
			status: "nuevo",
		});

		revalidatePath("/admin/leads");

		return { success: true };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const firstIssue = error.issues[0];
			return {
				success: false,
				error: firstIssue?.message ?? "Datos invalidos",
			};
		}
		console.error("Error creating valuation request:", error);
		return {
			success: false,
			error: "Error al enviar la solicitud. Por favor, intentelo de nuevo.",
		};
	}
}
