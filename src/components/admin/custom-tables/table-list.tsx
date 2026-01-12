"use client";

import {
	AddressBook,
	Briefcase,
	Buildings,
	CaretRight as ChevronRightIcon,
	ClipboardText,
	FileText,
	Folder,
	Gear,
	Table as TableIcon,
	Users,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

import { MOTION_DURATIONS, MOTION_EASINGS } from "@/components/motion";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CustomTable } from "@/lib/db/schema";

interface TableListProps {
	tables: CustomTable[];
}

// Icon map for custom tables
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
	users: Users,
	buildings: Buildings,
	briefcase: Briefcase,
	folder: Folder,
	"clipboard-text": ClipboardText,
	"file-text": FileText,
	"address-book": AddressBook,
	gear: Gear,
	table: TableIcon,
};

function getTableIcon(iconName?: string | null) {
	if (!iconName) return TableIcon;
	return iconMap[iconName] ?? TableIcon;
}

export function TableList({ tables }: TableListProps) {
	const shouldReduceMotion = useReducedMotion();

	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: shouldReduceMotion ? 0 : 0.05,
			},
		},
	};

	const itemVariants = {
		hidden: shouldReduceMotion ? {} : { opacity: 0, y: 10 },
		visible: shouldReduceMotion
			? {}
			: {
					opacity: 1,
					y: 0,
					transition: {
						duration: MOTION_DURATIONS.normal,
						ease: MOTION_EASINGS.smooth,
					},
				},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
		>
			{tables.map((table) => {
				const Icon = getTableIcon(table.icon);

				return (
					<motion.div key={table.id} variants={itemVariants}>
						<Link href={`/admin/tablas/${table.slug}`}>
							<Card className="hover:border-[var(--casalia-orange)]/50 hover:shadow-md transition-all cursor-pointer group">
								<CardHeader className="flex flex-row items-center gap-4">
									<div className="h-12 w-12 rounded-lg bg-[var(--casalia-orange)]/10 flex items-center justify-center shrink-0">
										<Icon className="h-6 w-6 text-[var(--casalia-orange)]" />
									</div>
									<div className="flex-1 min-w-0">
										<CardTitle className="text-lg truncate">
											{table.name}
										</CardTitle>
										{table.description && (
											<CardDescription className="truncate">
												{table.description}
											</CardDescription>
										)}
									</div>
									<ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-[var(--casalia-orange)] transition-colors" />
								</CardHeader>
							</Card>
						</Link>
					</motion.div>
				);
			})}
		</motion.div>
	);
}
