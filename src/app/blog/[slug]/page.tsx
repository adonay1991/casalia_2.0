import {
	ArrowLeft as ArrowLeftIcon,
	Calendar as CalendarIcon,
	Share as ShareIcon,
	User as UserIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/blog/post-card";
import { BlogPostSchema, BreadcrumbSchema } from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	getAllPostSlugs,
	getPostBySlug,
	getRecentPosts,
} from "@/lib/db/queries";

// Force dynamic rendering (requires DB at runtime, not build time)
export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casalia.org";

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

// Category to Spanish label mapping
const CATEGORY_LABELS: Record<string, string> = {
	noticias: "Noticias",
	consejos: "Consejos",
	mercado: "Mercado",
	decoracion: "Decoracion",
	legal: "Legal",
};

function formatDate(date: Date | null): string {
	if (!date) return "";
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

export async function generateStaticParams() {
	const slugs = await getAllPostSlugs();
	return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		return {
			title: "Articulo no encontrado | Casalia",
		};
	}

	return {
		title: `${post.title} | Blog Casalia`,
		description: post.excerpt ?? post.title,
		openGraph: {
			title: post.title,
			description: post.excerpt ?? post.title,
			type: "article",
			publishedTime: post.publishedAt?.toISOString(),
			images: post.featuredImage ? [post.featuredImage] : undefined,
		},
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = await getPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const categoryLabel = post.category
		? (CATEGORY_LABELS[post.category] ?? post.category)
		: null;

	// Get related posts (same category, excluding current)
	const relatedPosts = await getRecentPosts(4);
	const filteredRelatedPosts = relatedPosts
		.filter((p) => p.id !== post.id)
		.slice(0, 3);

	return (
		<>
			{/* Schema.org Structured Data */}
			<BlogPostSchema post={post} />
			<BreadcrumbSchema
				items={[
					{ name: "Inicio", url: BASE_URL },
					{ name: "Blog", url: `${BASE_URL}/blog` },
					{ name: post.title, url: `${BASE_URL}/blog/${post.slug}` },
				]}
			/>

			<div className="min-h-screen bg-background">
				{/* Featured Image */}
			{post.featuredImage && (
				<div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
					<Image
						src={post.featuredImage}
						alt={post.title}
						fill
						className="object-cover"
						priority
						sizes="100vw"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
				</div>
			)}

			<article className="container mx-auto px-4 md:px-6">
				{/* Main Content */}
				<div className="max-w-3xl mx-auto py-8 md:py-12">
					{/* Back link */}
					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						<span>Volver al blog</span>
					</Link>

					{/* Category */}
					{categoryLabel && (
						<Link href={`/blog?categoria=${post.category}`}>
							<Badge variant="secondary" className="mb-4 cursor-pointer">
								{categoryLabel}
							</Badge>
						</Link>
					)}

					{/* Title */}
					<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
						{post.title}
					</h1>

					{/* Meta Info */}
					<div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
						{/* Date */}
						<div className="flex items-center gap-2">
							<CalendarIcon className="h-4 w-4" />
							<span>{formatDate(post.publishedAt)}</span>
						</div>

						{/* Author */}
						{post.author && (
							<div className="flex items-center gap-2">
								{post.author.avatarUrl ? (
									<Image
										src={post.author.avatarUrl}
										alt={post.author.name}
										width={24}
										height={24}
										className="rounded-full"
									/>
								) : (
									<UserIcon className="h-4 w-4" />
								)}
								<span>{post.author.name}</span>
							</div>
						)}

						{/* Share button */}
						<Button variant="ghost" size="sm" className="ml-auto">
							<ShareIcon className="h-4 w-4 mr-2" />
							Compartir
						</Button>
					</div>

					{/* Content */}
					<div
						className="prose prose-lg max-w-none prose-headings:font-semibold prose-a:text-[var(--casalia-orange)] prose-img:rounded-lg"
						dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
					/>
				</div>

				{/* Related Posts */}
				{filteredRelatedPosts.length > 0 && (
					<section className="py-12 border-t">
						<div className="max-w-5xl mx-auto">
							<h2 className="text-2xl font-bold mb-6">
								Articulos relacionados
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{filteredRelatedPosts.map((relatedPost) => (
									<PostCard key={relatedPost.id} post={relatedPost} />
								))}
							</div>
						</div>
					</section>
				)}
				</article>
			</div>
		</>
	);
}
