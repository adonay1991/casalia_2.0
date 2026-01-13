"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Login action - TODO: Re-implement after Supabase reconnection
 */
export async function login(formData: FormData) {
	// TODO: Implement with Supabase Auth
	// For now, redirect to admin for testing
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	// Temporary: allow any login for testing
	if (!email || !password) {
		return { error: "Email y contraseña son requeridos" };
	}

	revalidatePath("/", "layout");

	const redirectTo = formData.get("redirect") as string | null;
	redirect(redirectTo || "/admin");
}

/**
 * Logout action - TODO: Re-implement after Supabase reconnection
 */
export async function logout() {
	// TODO: Implement with Supabase Auth
	revalidatePath("/", "layout");
	redirect("/");
}
