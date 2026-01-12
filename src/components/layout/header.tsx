"use client";

import { List as ListIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { MOTION_DURATIONS, MOTION_EASINGS } from "@/components/motion";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { mainNavItems } from "@/types/navigation";

export function Header() {
	const [isOpen, setIsOpen] = useState(false);
	const shouldReduceMotion = useReducedMotion();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
				{/* Logo con animacion de entrada */}
				<motion.div
					initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{
						duration: MOTION_DURATIONS.normal,
						ease: MOTION_EASINGS.smooth,
					}}
				>
					<Link href="/" className="flex items-center gap-2">
						<div className="relative h-10 w-32">
							<span className="font-bold text-xl text-[var(--casalia-orange)]">
								CASALIA
							</span>
						</div>
					</Link>
				</motion.div>

				{/* Desktop Navigation con stagger */}
				<motion.nav
					className="hidden md:flex items-center gap-6"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: shouldReduceMotion ? 0 : 0.05,
							},
						},
					}}
				>
					{mainNavItems.map((item) => (
						<motion.div
							key={item.href}
							variants={
								shouldReduceMotion
									? {}
									: {
											hidden: { opacity: 0, y: -10 },
											visible: { opacity: 1, y: 0 },
										}
							}
						>
							<Link
								href={item.href}
								className={cn(
									"text-sm font-medium transition-colors",
									"text-foreground/80 hover:text-primary",
								)}
							>
								{item.label}
							</Link>
						</motion.div>
					))}
				</motion.nav>

				{/* Mobile Navigation */}
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild className="md:hidden">
						<Button variant="ghost" size="icon" aria-label="Abrir menu">
							<ListIcon className="h-6 w-6" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[300px] sm:w-[400px]">
						<SheetHeader>
							<SheetTitle className="text-left text-[var(--casalia-orange)]">
								CASALIA
							</SheetTitle>
						</SheetHeader>
						<nav className="flex flex-col gap-4 mt-8">
							{mainNavItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsOpen(false)}
									className={cn(
										"text-lg font-medium py-2 transition-colors",
										"text-foreground hover:text-primary",
										"border-b border-border/40",
									)}
								>
									{item.label}
								</Link>
							))}
						</nav>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
