import { ArrowLeft as BackIcon } from "@phosphor-icons/react/ssr";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Editar Post | Casalia Admin",
	description: "Editar un post del blog",
};

interface EditPostPageProps {
	params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
	const { id } = await params;
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	const post = await db.query.posts.findFirst({
		where: eq(posts.id, id),
	});

	if (!post) {
		notFound();
	}

	return (
		<>
			<AdminHeader
				title="Editar Post"
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

				<PostForm authorId={user.id} post={post} />
			</main>
		</>
	);
}
