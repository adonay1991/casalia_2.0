import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();

	// Double-check auth (middleware should catch this, but just in case)
	if (!user) {
		redirect("/auth/login");
	}

	return (
		<div className="min-h-screen bg-zinc-50">
			{/* Sidebar - desktop */}
			<div className="hidden lg:block">
				<AdminSidebar
					user={{
						name: user.name,
						email: user.email,
						role: user.role,
						avatarUrl: user.avatarUrl,
					}}
				/>
			</div>

			{/* Main content */}
			<div className="lg:pl-64">{children}</div>
		</div>
	);
}
