"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { type Lead, leads } from "@/lib/db/schema";

export async function updateLeadStatus(formData: FormData): Promise<void> {
	const leadId = formData.get("leadId") as string;
	const status = formData.get("status") as Lead["status"];

	try {
		await db
			.update(leads)
			.set({
				status,
				updatedAt: new Date(),
			})
			.where(eq(leads.id, leadId));

		revalidatePath(`/admin/leads/${leadId}`);
		revalidatePath("/admin/leads");
		revalidatePath("/admin");
	} catch (error) {
		console.error("Error updating lead status:", error);
		// In a real app, we might want to use redirect with error param
		// or implement a different error handling pattern
	}
}

export async function updateLeadNotes(leadId: string, notes: string) {
	try {
		await db
			.update(leads)
			.set({
				notes,
				updatedAt: new Date(),
			})
			.where(eq(leads.id, leadId));

		revalidatePath(`/admin/leads/${leadId}`);

		return { success: true };
	} catch (error) {
		console.error("Error updating lead notes:", error);
		return { error: "Error al actualizar las notas" };
	}
}
