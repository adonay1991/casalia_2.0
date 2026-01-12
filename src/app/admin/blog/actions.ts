"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { type NewPost, posts } from "@/lib/db/schema";

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.replace(/[^a-z0-9\s-]/g, "") // Remove special chars
		.replace(/\s+/g, "-") // Replace spaces with hyphens
		.replace(/-+/g, "-") // Remove consecutive hyphens
		.trim();
}

export async function createPost(formData: FormData) {
	try {
		const title = formData.get("title") as string;
		const slug = generateSlug(title);
		const action = formData.get("action") as string;
		const isPublishing = action === "publish";

		// Check if slug exists
		const existingPost = await db.query.posts.findFirst({
			where: eq(posts.slug, slug),
		});

		const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug;

		const status = isPublishing
			? "publicado"
			: (formData.get("status") as NewPost["status"]) || "borrador";

		const newPost: NewPost = {
			slug: finalSlug,
			title,
			excerpt: (formData.get("excerpt") as string) || null,
			content: formData.get("content") as string,
			featuredImage: (formData.get("featuredImage") as string) || null,
			category: (formData.get("category") as string) || null,
			status,
			authorId: formData.get("authorId") as string,
			publishedAt: status === "publicado" ? new Date() : null,
		};

		await db.insert(posts).values(newPost);

		revalidatePath("/admin/blog");
		revalidatePath("/blog");

		return { success: true };
	} catch (error) {
		console.error("Error creating post:", error);
		return { error: "Error al crear el post" };
	}
}

export async function updatePost(formData: FormData) {
	try {
		const postId = formData.get("postId") as string;
		const action = formData.get("action") as string;

		// Get current post to check if we're publishing for the first time
		const currentPost = await db.query.posts.findFirst({
			where: eq(posts.id, postId),
		});

		const newStatus =
			action === "publish"
				? "publicado"
				: (formData.get("status") as NewPost["status"]);

		// Set publishedAt if publishing for the first time
		const publishedAt =
			newStatus === "publicado" && currentPost?.status !== "publicado"
				? new Date()
				: currentPost?.publishedAt;

		const updates = {
			title: formData.get("title") as string,
			excerpt: (formData.get("excerpt") as string) || null,
			content: formData.get("content") as string,
			featuredImage: (formData.get("featuredImage") as string) || null,
			category: (formData.get("category") as string) || null,
			status: newStatus,
			publishedAt,
			updatedAt: new Date(),
		};

		await db.update(posts).set(updates).where(eq(posts.id, postId));

		revalidatePath("/admin/blog");
		revalidatePath("/blog");

		return { success: true };
	} catch (error) {
		console.error("Error updating post:", error);
		return { error: "Error al actualizar el post" };
	}
}

export async function deletePost(postId: string) {
	try {
		await db.delete(posts).where(eq(posts.id, postId));

		revalidatePath("/admin/blog");
		revalidatePath("/blog");

		return { success: true };
	} catch (error) {
		console.error("Error deleting post:", error);
		return { error: "Error al eliminar el post" };
	}
}
