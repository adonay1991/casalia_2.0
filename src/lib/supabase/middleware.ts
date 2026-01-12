import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	});

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({
						request,
					});
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	// IMPORTANT: Avoid writing any logic between createServerClient and
	// supabase.auth.getUser(). A simple mistake could make your app very slow.
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Protected routes check
	const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

	if (isAdminRoute) {
		// Not authenticated - redirect to login
		if (!user) {
			const url = request.nextUrl.clone();
			url.pathname = "/auth/login";
			url.searchParams.set("redirect", request.nextUrl.pathname);
			return NextResponse.redirect(url);
		}

		// Skip database check in middleware to avoid slowdowns
		// The admin layout will verify user role from database
		// This makes the middleware faster and more resilient
	}

	return supabaseResponse;
}
