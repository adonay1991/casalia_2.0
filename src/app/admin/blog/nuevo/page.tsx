import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
	title: "Nuevo Post | Casalia Admin",
	description: "Crear un nuevo post del blog",
};

export default async function NuevoPostPage() {
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	return (
		<>
			<AdminHeader
				title="Nuevo Post"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6">
				<div className="mb-6">
					<Link href="/admin/blog">
						<Button variant="ghost" size="sm" className="gap-2">
							<BackIcon className="h-4 w-4" />
							Volver al blog
						</Button>
					</Link>
				</div>

				<PostForm authorId={user.id} />
			</main>
		</>
	);
}
