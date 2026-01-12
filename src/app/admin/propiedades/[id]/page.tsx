import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import { asc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { PropertyForm } from "@/components/admin/property-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { properties, propertyImages } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Editar Propiedad | Casalia Admin",
	description: "Editar una propiedad existente",
};

interface EditPropertyPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({
	params,
}: EditPropertyPageProps) {
	const { id } = await params;
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	const [property, images] = await Promise.all([
		db.query.properties.findFirst({
			where: eq(properties.id, id),
		}),
		db
			.select({
				id: propertyImages.id,
				url: propertyImages.url,
				order: propertyImages.order,
				isPrimary: propertyImages.isPrimary,
			})
			.from(propertyImages)
			.where(eq(propertyImages.propertyId, id))
			.orderBy(asc(propertyImages.order)),
	]);

	if (!property) {
		notFound();
	}

	const initialImages = images.map((img) => ({
		id: img.id,
		url: img.url,
		order: img.order,
		isPrimary: img.isPrimary ?? false,
	}));

	return (
		<>
			<AdminHeader
				title="Editar Propiedad"
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

				<PropertyForm
					userId={user.id}
					property={property}
					initialImages={initialImages}
				/>
			</main>
		</>
	);
}
