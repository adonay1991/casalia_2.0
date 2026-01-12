"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { STAGGER_CONFIG, type StaggerSpeed } from "./motion-config";

interface StaggerListProps {
	children: ReactNode;
	staggerSpeed?: StaggerSpeed;
	className?: string;
	once?: boolean;
	amount?: number;
}

export function StaggerList({
	children,
	staggerSpeed = "normal",
	className,
	once = true,
	amount = 0.2,
}: StaggerListProps) {
	const shouldReduceMotion = useReducedMotion();

	// Accesibilidad: sin animaciones si el usuario lo prefiere
	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	const staggerDelay = STAGGER_CONFIG[staggerSpeed];

	return (
		<motion.div
			initial="hidden"
			whileInView="visible"
			viewport={{ once, amount }}
			variants={{
				hidden: {},
				visible: {
					transition: {
						staggerChildren: staggerDelay,
					},
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
