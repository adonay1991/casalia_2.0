"use client";

import { StaggerItem } from "@/components/motion";
import { PostCard } from "./post-card";
import type { PostWithAuthor } from "@/lib/db/queries";

interface AnimatedPostCardProps {
	post: PostWithAuthor;
}

/**
 * Wrapper animado para PostCard.
 * Usa StaggerItem para animacion escalonada cuando se usa dentro de StaggerList.
 */
export function AnimatedPostCard({ post }: AnimatedPostCardProps) {
	return (
		<StaggerItem>
			<PostCard post={post} />
		</StaggerItem>
	);
}
