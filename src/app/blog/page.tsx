import { Newspaper as NewspaperIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";

import { PostCard } from "@/components/blog/post-card";
import { Badge } from "@/components/ui/badge";
import { getBlogCategories, getPosts } from "@/lib/db/queries";

export const metadata: Metadata = {
	title: "Blog Inmobiliario | Casalia",
	description:
		"Noticias, consejos y novedades del mercado inmobiliario en Parla y Madrid. Tu fuente de informacion para comprar, vender o alquilar.",
};

// Category to Spanish label mapping
const CATEGORY_LABELS: Record<string, string> = {
	noticias: "Noticias",
	consejos: "Consejos",
	mercado: "Mercado",
	decoracion: "Decoracion",
	legal: "Legal",
};

interface BlogPageProps {
	searchParams: Promise<{
		categoria?: string;
	}>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
	const params = await searchParams;
	const selectedCategory = params.categoria;

	// Fetch posts and categories in parallel
	const [posts, categories] = await Promise.all([
		getPosts({
			category: selectedCategory,
			limit: 50,
		}),
		getBlogCategories(),
	]);

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<section className="bg-[var(--casalia-dark)] text-white py-12">
				<div className="container mx-auto px-4 md:px-6">
					<div className="flex items-center gap-3 mb-4">
						<NewspaperIcon className="h-8 w-8 text-[var(--casalia-orange)]" />
						<h1 className="text-3xl md:text-4xl font-bold">
							Blog Inmobiliario
						</h1>
					</div>
					<p className="text-white/80 max-w-2xl">
						Noticias, consejos y novedades del mercado inmobiliario. Mantente
						informado sobre tendencias, regulaciones y oportunidades.
					</p>
				</div>
			</section>

			{/* Category Filter */}
			{categories.length > 0 && (
				<section className="border-b border-border bg-card">
					<div className="container mx-auto px-4 md:px-6 py-4">
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-sm text-muted-foreground mr-2">
								Categorias:
							</span>
							<Link href="/blog">
								<Badge
									variant={!selectedCategory ? "default" : "outline"}
									className="cursor-pointer"
								>
									Todas
								</Badge>
							</Link>
							{categories.map((category) => (
								<Link key={category} href={`/blog?categoria=${category}`}>
									<Badge
										variant={
											selectedCategory === category ? "default" : "outline"
										}
										className="cursor-pointer"
									>
										{CATEGORY_LABELS[category] ?? category}
									</Badge>
								</Link>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Posts Grid */}
			<section className="py-12">
				<div className="container mx-auto px-4 md:px-6">
					{posts.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{posts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					) : (
						<div className="text-center py-16">
							<NewspaperIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
							<h2 className="text-xl font-semibold mb-2">
								{selectedCategory
									? "No hay articulos en esta categoria"
									: "No hay articulos disponibles"}
							</h2>
							<p className="text-muted-foreground">
								{selectedCategory
									? "Prueba a seleccionar otra categoria o ver todos los articulos."
									: "Estamos preparando contenido interesante. Vuelve pronto."}
							</p>
							{selectedCategory && (
								<Link
									href="/blog"
									className="text-[var(--casalia-orange)] hover:underline mt-4 inline-block"
								>
									Ver todos los articulos
								</Link>
							)}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
