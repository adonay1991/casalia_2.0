import {
	Calendar as CalendarIcon,
	User as UserIcon,
} from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { PostWithAuthor } from "@/lib/db/queries";

interface PostCardProps {
	post: PostWithAuthor;
}

function formatDate(date: Date | null): string {
	if (!date) return "";
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
}

// Category to Spanish label mapping
const CATEGORY_LABELS: Record<string, string> = {
	noticias: "Noticias",
	consejos: "Consejos",
	mercado: "Mercado",
	decoracion: "Decoracion",
	legal: "Legal",
};

export function PostCard({ post }: PostCardProps) {
	const categoryLabel = post.category
		? (CATEGORY_LABELS[post.category] ?? post.category)
		: null;

	return (
		<Card className="overflow-hidden flex flex-col h-full group">
			{/* Image */}
			<Link href={`/blog/${post.slug}`} className="block">
				<div className="relative aspect-video overflow-hidden">
					{post.featuredImage ? (
						<Image
							src={post.featuredImage}
							alt={post.title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
						/>
					) : (
						<div className="w-full h-full bg-muted flex items-center justify-center">
							<span className="text-muted-foreground text-sm">Sin imagen</span>
						</div>
					)}
				</div>
			</Link>

			<CardHeader className="pb-2">
				{/* Category */}
				{categoryLabel && (
					<Badge variant="secondary" className="w-fit text-xs">
						{categoryLabel}
					</Badge>
				)}

				{/* Title */}
				<Link href={`/blog/${post.slug}`} className="block">
					<h3 className="text-lg font-semibold line-clamp-2 group-hover:text-[var(--casalia-orange)] transition-colors">
						{post.title}
					</h3>
				</Link>
			</CardHeader>

			<CardContent className="flex-1">
				{/* Excerpt */}
				{post.excerpt && (
					<p className="text-muted-foreground text-sm line-clamp-3">
						{post.excerpt}
					</p>
				)}
			</CardContent>

			<CardFooter className="pt-0 text-xs text-muted-foreground">
				<div className="flex items-center gap-4">
					{/* Date */}
					<div className="flex items-center gap-1">
						<CalendarIcon className="h-3.5 w-3.5" />
						<span>{formatDate(post.publishedAt)}</span>
					</div>

					{/* Author */}
					{post.author && (
						<div className="flex items-center gap-1">
							<UserIcon className="h-3.5 w-3.5" />
							<span>{post.author.name}</span>
						</div>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
