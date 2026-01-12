import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database";

export async function createClient() {
	const cookieStore = await cookies();

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						for (const { name, value, options } of cookiesToSet) {
							cookieStore.set(name, value, options);
						}
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing sessions.
					}
				},
			},
		},
	);
}

/**
 * Creates a Supabase client with service role key for admin operations.
 * Only use this for server-side admin operations like migrations, webhooks, etc.
 * NEVER expose this client to the browser.
 */
export function createServiceClient() {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			cookies: {
				getAll() {
					return [];
				},
				setAll() {
					// No-op for service client
				},
			},
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);
}
