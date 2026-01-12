import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getCurrentUser();

	// Redirect to login if not authenticated or user not in database
	if (!user) {
		redirect("/auth/login?error=Usuario no encontrado en la base de datos");
	}

	// Check user has valid role
	if (!["admin", "agent"].includes(user.role)) {
		redirect("/auth/login?error=No tienes permisos para acceder al panel");
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
