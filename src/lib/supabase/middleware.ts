import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
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
					supabaseResponse = NextResponse.next({ request });
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	// Do not run code between createServerClient and supabase.auth.getUser()
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Protected routes - redirect to login if not authenticated
	if (
		!user &&
		request.nextUrl.pathname.startsWith("/admin")
	) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth/login";
		url.searchParams.set("redirect", request.nextUrl.pathname);
		return NextResponse.redirect(url);
	}

	return supabaseResponse;
}
