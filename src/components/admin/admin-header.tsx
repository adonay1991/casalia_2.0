"use client";

import {
	Bell as BellIcon,
	List as MenuIcon,
	MagnifyingGlass as SearchIcon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";

import { MOTION_DURATIONS, MOTION_EASINGS } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminMobileNav } from "./admin-mobile-nav";

interface AdminHeaderProps {
	title: string;
	user: {
		name: string;
		email: string;
		role: string;
		avatarUrl?: string | null;
	};
}

export function AdminHeader({ title, user }: AdminHeaderProps) {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	// Memoized callback to prevent infinite re-renders in AdminMobileNav
	// (its useEffect depends on onClose, so we need a stable reference)
	const handleCloseMobileNav = useCallback(() => {
		setMobileNavOpen(false);
	}, []);

	return (
		<>
			<motion.header
				initial={shouldReduceMotion ? false : { opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: MOTION_DURATIONS.normal,
					ease: MOTION_EASINGS.smooth,
				}}
				className="sticky top-0 z-40 h-16 bg-background border-b border-border flex items-center px-4 md:px-6 gap-4"
			>
				{/* Mobile menu button */}
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden"
					onClick={() => setMobileNavOpen(true)}
				>
					<MenuIcon className="h-5 w-5" />
					<span className="sr-only">Abrir menu</span>
				</Button>

				{/* Page title */}
				<h1 className="text-lg font-semibold flex-1">{title}</h1>

				{/* Search (desktop) */}
				<div className="hidden md:flex relative max-w-sm">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Buscar..." className="pl-9 w-64" />
				</div>

				{/* Notifications */}
				<Button variant="ghost" size="icon" className="relative">
					<BellIcon className="h-5 w-5" />
					<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--casalia-orange)] rounded-full" />
					<span className="sr-only">Notificaciones</span>
				</Button>
			</motion.header>

			{/* Mobile navigation */}
			<AdminMobileNav
				user={user}
				isOpen={mobileNavOpen}
				onClose={handleCloseMobileNav}
			/>
		</>
	);
}
