"use client";

import {
	Article as BlogIcon,
	ChartBar as DashboardIcon,
	Users as LeadsIcon,
	SignOut as LogoutIcon,
	House as PropertyIcon,
	Gear as SettingsIcon,
	Table as TableIcon,
	UserCircle as UserIcon,
} from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/app/auth/login/actions";
import { MOTION_DURATIONS, MOTION_EASINGS } from "@/components/motion";

const navigation = [
	{ name: "Dashboard", href: "/admin", icon: DashboardIcon },
	{ name: "Propiedades", href: "/admin/propiedades", icon: PropertyIcon },
	{ name: "Leads", href: "/admin/leads", icon: LeadsIcon },
	{ name: "Blog", href: "/admin/blog", icon: BlogIcon },
	{ name: "Tablas", href: "/admin/tablas", icon: TableIcon },
];

const secondaryNavigation = [
	{ name: "Configuracion", href: "/admin/configuracion", icon: SettingsIcon },
];

interface AdminSidebarProps {
	user: {
		name: string;
		email: string;
		role: string;
		avatarUrl?: string | null;
	};
}

export function AdminSidebar({ user }: AdminSidebarProps) {
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	const isActive = (href: string) => {
		if (href === "/admin") {
			return pathname === "/admin";
		}
		return pathname.startsWith(href);
	};

	const containerVariants = {
		hidden: {},
		visible: {
			transition: {
				staggerChildren: shouldReduceMotion ? 0 : 0.05,
			},
		},
	};

	const itemVariants = {
		hidden: shouldReduceMotion ? {} : { opacity: 0, x: -10 },
		visible: shouldReduceMotion
			? {}
			: {
					opacity: 1,
					x: 0,
					transition: {
						duration: MOTION_DURATIONS.normal,
						ease: MOTION_EASINGS.smooth,
					},
				},
	};

	return (
		<aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--casalia-dark)] flex flex-col">
			{/* Logo */}
			<motion.div
				initial={shouldReduceMotion ? false : { opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: MOTION_DURATIONS.normal }}
				className="h-16 flex items-center px-6 border-b border-white/10"
			>
				<Link href="/admin" className="flex items-center gap-2">
					<Image
						src="/casalia-logo-white.svg"
						alt="Casalia"
						width={120}
						height={36}
						className="h-8 w-auto"
					/>
					<span className="text-xs font-medium text-white/60 bg-white/10 px-2 py-0.5 rounded">
						Admin
					</span>
				</Link>
			</motion.div>

			{/* Navigation */}
			<motion.nav
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="flex-1 px-4 py-6 space-y-1 overflow-y-auto"
			>
				{navigation.map((item) => {
					const active = isActive(item.href);
					return (
						<motion.div key={item.name} variants={itemVariants}>
							<Link
								href={item.href}
								className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
									active
										? "bg-[var(--casalia-orange)] text-white"
										: "text-white/70 hover:text-white hover:bg-white/10"
								}`}
							>
								<item.icon className="h-5 w-5" />
								{item.name}
							</Link>
						</motion.div>
					);
				})}

				<div className="pt-6 mt-6 border-t border-white/10">
					{secondaryNavigation.map((item) => {
						const active = isActive(item.href);
						return (
							<motion.div key={item.name} variants={itemVariants}>
								<Link
									href={item.href}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
										active
											? "bg-[var(--casalia-orange)] text-white"
											: "text-white/70 hover:text-white hover:bg-white/10"
									}`}
								>
									<item.icon className="h-5 w-5" />
									{item.name}
								</Link>
							</motion.div>
						);
					})}
				</div>
			</motion.nav>

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
						className="w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
					>
						<LogoutIcon className="h-5 w-5" />
						Cerrar sesion
					</button>
				</form>
			</div>
		</aside>
	);
}
