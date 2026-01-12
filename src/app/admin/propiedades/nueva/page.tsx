import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { PropertyForm } from "@/components/admin/property-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Nueva Propiedad | Casalia Admin",
	description: "Crear una nueva propiedad",
};

export default async function NuevaPropiedadPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	return (
		<>
			<AdminHeader
				title="Nueva Propiedad"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6">
				<div className="mb-6">
					<Link href="/admin/propiedades">
						<Button variant="ghost" size="sm" className="gap-2">
							<BackIcon className="h-4 w-4" />
							Volver a propiedades
						</Button>
					</Link>
				</div>

				<PropertyForm userId={user.id} />
			</main>
		</>
	);
}
