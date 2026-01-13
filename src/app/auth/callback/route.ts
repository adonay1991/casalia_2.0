import { type NextRequest, NextResponse } from "next/server";

/**
 * Auth Callback Route - TODO: Re-implement after Supabase reconnection
 * This route handles OAuth callback from Supabase Auth
 */
export async function GET(request: NextRequest) {
	const { origin } = new URL(request.url);

	// TODO: Implement OAuth callback with Supabase Auth
	// For now, redirect to login with a message
	return NextResponse.redirect(
		`${origin}/auth/login?error=auth_not_configured`,
	);
}
