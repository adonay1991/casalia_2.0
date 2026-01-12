"use client";

import {
	Article as BlogIcon,
	X as CloseIcon,
	ChartBar as DashboardIcon,
	Users as LeadsIcon,
	SignOut as LogoutIcon,
	House as PropertyIcon,
	Gear as SettingsIcon,
	UserCircle as UserIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { logout } from "@/app/auth/login/actions";
import { MOTION_DURATIONS, MOTION_EASINGS } from "@/components/motion";

const navigation = [
	{ name: "Dashboard", href: "/admin", icon: DashboardIcon },
	{ name: "Propiedades", href: "/admin/propiedades", icon: PropertyIcon },
	{ name: "Leads", href: "/admin/leads", icon: LeadsIcon },
	{ name: "Blog", href: "/admin/blog", icon: BlogIcon },
	{ name: "Configuracion", href: "/admin/configuracion", icon: SettingsIcon },
];

interface AdminMobileNavProps {
	user: {
		name: string;
		email: string;
		role: string;
		avatarUrl?: string | null;
	};
	isOpen: boolean;
	onClose: () => void;
}

export function AdminMobileNav({ user, isOpen, onClose }: AdminMobileNavProps) {
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	// Close on route change (only if open)
	useEffect(() => {
		if (isOpen) {
			onClose();
		}
	}, [pathname, isOpen, onClose]);

	// Close on escape
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose]);

	const isActive = (href: string) => {
		if (href === "/admin") {
			return pathname === "/admin";
		}
		return pathname.startsWith(href);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={shouldReduceMotion ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: MOTION_DURATIONS.fast }}
						className="fixed inset-0 z-50 bg-black/50 lg:hidden"
						onClick={onClose}
						aria-hidden="true"
					/>

					{/* Drawer */}
					<motion.div
						initial={shouldReduceMotion ? false : { x: "-100%" }}
						animate={{ x: 0 }}
						exit={{ x: "-100%" }}
						transition={{
							duration: MOTION_DURATIONS.normal,
							ease: MOTION_EASINGS.smooth,
						}}
						className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--casalia-dark)] flex flex-col lg:hidden">
				{/* Header */}
				<div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
					<Link
						href="/admin"
						className="flex items-center gap-2"
						onClick={onClose}
					>
						<Image
							src="/casalia-logo-white.svg"
							alt="Casalia"
							width={120}
							height={36}
							className="h-8 w-auto"
						/>
					</Link>
					<button
						onClick={onClose}
						className="p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
					>
						<CloseIcon className="h-5 w-5" />
						<span className="sr-only">Cerrar menu</span>
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
					{navigation.map((item) => {
						const active = isActive(item.href);
						return (
							<Link
								key={item.name}
								href={item.href}
								className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
									active
										? "bg-[var(--casalia-orange)] text-white"
										: "text-white/70 hover:text-white hover:bg-white/10"
								}`}
							>
								<item.icon className="h-5 w-5" />
								{item.name}
							</Link>
						);
					})}
				</nav>

				{/* User section */}
				<div className="p-4 border-t border-white/10">
					<div className="flex items-center gap-3 px-3 py-2">
						{user.avatarUrl ? (
							<Image
								src={user.avatarUrl}
								alt={user.name}
								width={36}
								height={36}
								className="h-9 w-9 rounded-full object-cover"
							/>
						) : (
							<div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
								<UserIcon className="h-5 w-5 text-white/70" />
							</div>
						)}
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-white truncate">
								{user.name}
							</p>
							<p className="text-xs text-white/50 capitalize">{user.role}</p>
						</div>
					</div>

					<form action={logout}>
						<button
							type="submit"
							className="w-full mt-2 flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
						>
							<LogoutIcon className="h-5 w-5" />
							Cerrar sesion
						</button>
					</form>
				</div>
			</motion.div>
		</>
			)}
		</AnimatePresence>
	);
}
