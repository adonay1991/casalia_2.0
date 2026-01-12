"use client";

import { SpinnerGap as SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import { createPost, updatePost } from "@/app/admin/blog/actions";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Post } from "@/lib/db/schema";

interface PostFormProps {
	authorId: string;
	post?: Post;
}

interface FormState {
	error?: string;
	success?: boolean;
}

const CATEGORIES = [
	{ value: "consejos", label: "Consejos" },
	{ value: "mercado", label: "Mercado" },
	{ value: "guias", label: "Guias" },
	{ value: "noticias", label: "Noticias" },
	{ value: "legal", label: "Legal" },
];

export function PostForm({ authorId, post }: PostFormProps) {
	const router = useRouter();
	const isEditing = !!post;
	const [content, setContent] = useState(post?.content ?? "");

	const formAction = async (
		_prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		formData.set("authorId", authorId);

		if (isEditing && post) {
			formData.set("postId", post.id);
			const result = await updatePost(formData);
			if (result?.error) {
				return { error: result.error };
			}
		} else {
			const result = await createPost(formData);
			if (result?.error) {
				return { error: result.error };
			}
		}

		router.push("/admin/blog");
		router.refresh();
		return { success: true };
	};

	const [state, action, isPending] = useActionState(formAction, {});

	return (
		<form action={action} className="space-y-6 max-w-4xl">
			{state.error && (
				<div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
					{state.error}
				</div>
			)}

			{/* Basic Info */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Contenido</h2>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Titulo *</Label>
						<Input
							id="title"
							name="title"
							defaultValue={post?.title}
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="excerpt">Extracto</Label>
						<textarea
							id="excerpt"
							name="excerpt"
							rows={2}
							defaultValue={post?.excerpt ?? ""}
							disabled={isPending}
							placeholder="Breve descripcion del post (aparece en listados)"
							className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
						/>
					</div>

					<div className="space-y-2">
						<Label>Contenido *</Label>
						<RichTextEditor
							content={content}
							onChange={setContent}
							placeholder="Escribe el contenido del post aqui..."
							disabled={isPending}
						/>
					</div>
				</div>
			</Card>

			{/* Meta */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Configuracion</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="category">Categoria</Label>
						<select
							id="category"
							name="category"
							defaultValue={post?.category ?? ""}
							disabled={isPending}
							className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
						>
							<option value="">Sin categoria</option>
							{CATEGORIES.map((cat) => (
								<option key={cat.value} value={cat.value}>
									{cat.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="featuredImage">Imagen destacada (URL)</Label>
						<Input
							id="featuredImage"
							name="featuredImage"
							type="url"
							defaultValue={post?.featuredImage ?? ""}
							disabled={isPending}
							placeholder="https://..."
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Estado</Label>
						<select
							id="status"
							name="status"
							defaultValue={post?.status || "borrador"}
							disabled={isPending}
							className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
						>
							<option value="borrador">Borrador</option>
							<option value="publicado">Publicado</option>
						</select>
					</div>
				</div>
			</Card>

			{/* Submit */}
			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={isPending}
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					name="action"
					value="save"
					variant="outline"
					disabled={isPending}
				>
					Guardar borrador
				</Button>
				<Button
					type="submit"
					name="action"
					value="publish"
					className="bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]"
					disabled={isPending}
				>
					{isPending ? (
						<>
							<SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
							Guardando...
						</>
					) : isEditing ? (
						"Actualizar"
					) : (
						"Publicar"
					)}
				</Button>
			</div>
		</form>
	);
}
