import {
	PencilSimple as EditIcon,
	Plus as PlusIcon,
	Eye as ViewIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminHeader } from "@/components/admin/admin-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getAdminPosts } from "@/lib/db/admin-queries";

export const metadata: Metadata = {
	title: "Blog | Casalia Admin",
	description: "Gestiona los posts del blog de Casalia",
};

interface BlogAdminPageProps {
	searchParams: Promise<{
		status?: string;
		pagina?: string;
	}>;
}

export default async function BlogAdminPage({
	searchParams,
}: BlogAdminPageProps) {
	const params = await searchParams;
	const user = await getCurrentUser();

	if (!user) return null;

	const currentPage = Math.max(1, Number(params.pagina) || 1);
	const limit = 20;
	const offset = (currentPage - 1) * limit;

	const { posts, total } = await getAdminPosts({
		status: params.status as "borrador" | "publicado" | undefined,
		limit,
		offset,
	});

	const totalPages = Math.ceil(total / limit);

	return (
		<>
			<AdminHeader
				title="Blog"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6 space-y-6">
				{/* Actions bar */}
				<div className="flex flex-col sm:flex-row gap-4 justify-between">
					<StatusFilter current={params.status} />
					<Link href="/admin/blog/nuevo">
						<Button className="bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]">
							<PlusIcon className="h-4 w-4 mr-2" />
							Nuevo post
						</Button>
					</Link>
				</div>

				{/* Posts table */}
				<Card>
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-zinc-50 border-b border-border">
								<tr>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Titulo
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Estado
									</th>
									<th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
										Fecha
									</th>
									<th className="text-right px-4 py-3 text-sm font-medium text-muted-foreground">
										Acciones
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{posts.length > 0 ? (
									posts.map((post) => (
										<tr key={post.id} className="hover:bg-zinc-50">
											<td className="px-4 py-3">
												<p className="font-medium">{post.title}</p>
												<p className="text-sm text-muted-foreground">
													/{post.slug}
												</p>
											</td>
											<td className="px-4 py-3">
												<Badge
													variant={
														post.status === "publicado"
															? "default"
															: "secondary"
													}
													className={
														post.status === "publicado"
															? "bg-green-100 text-green-700 hover:bg-green-100"
															: ""
													}
												>
													{post.status === "publicado"
														? "Publicado"
														: "Borrador"}
												</Badge>
											</td>
											<td className="px-4 py-3 text-sm text-muted-foreground">
												{post.publishedAt
													? formatDate(post.publishedAt)
													: formatDate(post.createdAt)}
											</td>
											<td className="px-4 py-3">
												<div className="flex justify-end gap-2">
													{post.status === "publicado" && (
														<Link href={`/blog/${post.slug}`} target="_blank">
															<Button variant="ghost" size="icon">
																<ViewIcon className="h-4 w-4" />
																<span className="sr-only">Ver</span>
															</Button>
														</Link>
													)}
													<Link href={`/admin/blog/${post.id}`}>
														<Button variant="ghost" size="icon">
															<EditIcon className="h-4 w-4" />
															<span className="sr-only">Editar</span>
														</Button>
													</Link>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td
											colSpan={4}
											className="px-4 py-12 text-center text-muted-foreground"
										>
											No hay posts
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between px-4 py-3 border-t border-border">
							<p className="text-sm text-muted-foreground">
								Mostrando {offset + 1} - {Math.min(offset + limit, total)} de{" "}
								{total}
							</p>
							<div className="flex gap-2">
								{currentPage > 1 && (
									<Link
										href={`/admin/blog?pagina=${currentPage - 1}${params.status ? `&status=${params.status}` : ""}`}
									>
										<Button variant="outline" size="sm">
											Anterior
										</Button>
									</Link>
								)}
								{currentPage < totalPages && (
									<Link
										href={`/admin/blog?pagina=${currentPage + 1}${params.status ? `&status=${params.status}` : ""}`}
									>
										<Button variant="outline" size="sm">
											Siguiente
										</Button>
									</Link>
								)}
							</div>
						</div>
					)}
				</Card>
			</main>
		</>
	);
}

function StatusFilter({ current }: { current?: string }) {
	const statuses = [
		{ value: undefined, label: "Todos" },
		{ value: "publicado", label: "Publicados" },
		{ value: "borrador", label: "Borradores" },
	];

	return (
		<div className="flex gap-1 p-1 bg-zinc-100 rounded-lg w-fit">
			{statuses.map((status) => (
				<Link
					key={status.value ?? "all"}
					href={`/admin/blog${status.value ? `?status=${status.value}` : ""}`}
				>
					<Button
						variant="ghost"
						size="sm"
						className={
							current === status.value ||
							(current === undefined && status.value === undefined)
								? "bg-white shadow-sm"
								: ""
						}
					>
						{status.label}
					</Button>
				</Link>
			))}
		</div>
	);
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
}
