/**
 * Authentication Utilities
 *
 * Helper functions for user authentication and authorization.
 */

import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type User, users } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "agent";

/**
 * Get the current authenticated user from Supabase Auth
 */
export async function getAuthUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}

/**
 * Get the current user with their role from the database
 */
export async function getCurrentUser(): Promise<User | null> {
	const authUser = await getAuthUser();

	if (!authUser) {
		return null;
	}

	const dbUser = await db.query.users.findFirst({
		where: eq(users.id, authUser.id),
	});

	return dbUser ?? null;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
	const user = await getCurrentUser();
	return user?.role === role;
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
	return hasRole("admin");
}

/**
 * Check if the current user has access to admin routes
 * Both admin and agent roles can access admin routes
 */
export async function canAccessAdmin(): Promise<boolean> {
	const user = await getCurrentUser();
	return user !== null && (user.role === "admin" || user.role === "agent");
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("Unauthorized: Authentication required");
	}

	return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin(): Promise<User> {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("Unauthorized: Authentication required");
	}

	if (user.role !== "admin") {
		throw new Error("Forbidden: Admin access required");
	}

	return user;
}
