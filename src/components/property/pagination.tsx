"use client";

import {
	CaretLeft as ChevronLeftIcon,
	CaretRight as ChevronRightIcon,
	DotsThree as DotsIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	/** Number of page buttons to show on each side of current page */
	siblingCount?: number;
}

/**
 * Generate array of page numbers to display
 * Shows first, last, current, and siblings with ellipsis
 */
function generatePageNumbers(
	currentPage: number,
	totalPages: number,
	siblingCount: number,
): (number | "ellipsis")[] {
	const pages: (number | "ellipsis")[] = [];

	// Always show first page
	pages.push(1);

	// Calculate range around current page
	const leftSibling = Math.max(2, currentPage - siblingCount);
	const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);

	// Add ellipsis after first page if needed
	if (leftSibling > 2) {
		pages.push("ellipsis");
	}

	// Add pages in range
	for (let i = leftSibling; i <= rightSibling; i++) {
		if (i !== 1 && i !== totalPages) {
			pages.push(i);
		}
	}

	// Add ellipsis before last page if needed
	if (rightSibling < totalPages - 1) {
		pages.push("ellipsis");
	}

	// Always show last page if more than 1 page
	if (totalPages > 1) {
		pages.push(totalPages);
	}

	return pages;
}

export function Pagination({
	currentPage,
	totalPages,
	siblingCount = 1,
}: PaginationProps) {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	// Don't render if only one page
	if (totalPages <= 1) {
		return null;
	}

	// Create URL with page parameter
	const createPageUrl = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		if (page === 1) {
			params.delete("pagina");
		} else {
			params.set("pagina", String(page));
		}
		const queryString = params.toString();
		return `${pathname}${queryString ? `?${queryString}` : ""}`;
	};

	const pageNumbers = generatePageNumbers(
		currentPage,
		totalPages,
		siblingCount,
	);

	return (
		<nav
			role="navigation"
			aria-label="Paginacion"
			className="flex items-center justify-center gap-1"
		>
			{/* Previous button */}
			<Button
				variant="outline"
				size="icon"
				className="h-9 w-9"
				disabled={currentPage <= 1}
				asChild={currentPage > 1}
			>
				{currentPage > 1 ? (
					<Link
						href={createPageUrl(currentPage - 1)}
						aria-label="Pagina anterior"
					>
						<ChevronLeftIcon className="h-4 w-4" />
					</Link>
				) : (
					<span>
						<ChevronLeftIcon className="h-4 w-4" />
					</span>
				)}
			</Button>

			{/* Page numbers */}
			{pageNumbers.map((page, index) => {
				if (page === "ellipsis") {
					return (
						<span
							key={`ellipsis-${index}`}
							className="flex h-9 w-9 items-center justify-center text-muted-foreground"
						>
							<DotsIcon className="h-4 w-4" />
						</span>
					);
				}

				const isCurrentPage = page === currentPage;

				return (
					<Button
						key={page}
						variant={isCurrentPage ? "default" : "outline"}
						size="icon"
						className={cn("h-9 w-9", isCurrentPage && "pointer-events-none")}
						aria-current={isCurrentPage ? "page" : undefined}
						asChild={!isCurrentPage}
					>
						{isCurrentPage ? (
							<span>{page}</span>
						) : (
							<Link href={createPageUrl(page)} aria-label={`Pagina ${page}`}>
								{page}
							</Link>
						)}
					</Button>
				);
			})}

			{/* Next button */}
			<Button
				variant="outline"
				size="icon"
				className="h-9 w-9"
				disabled={currentPage >= totalPages}
				asChild={currentPage < totalPages}
			>
				{currentPage < totalPages ? (
					<Link
						href={createPageUrl(currentPage + 1)}
						aria-label="Pagina siguiente"
					>
						<ChevronRightIcon className="h-4 w-4" />
					</Link>
				) : (
					<span>
						<ChevronRightIcon className="h-4 w-4" />
					</span>
				)}
			</Button>
		</nav>
	);
}
