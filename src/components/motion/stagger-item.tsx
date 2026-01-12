"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { MOTION_DURATIONS, MOTION_EASINGS } from "./motion-config";

interface StaggerItemProps {
	children: ReactNode;
	className?: string;
}

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: MOTION_DURATIONS.normal,
			ease: MOTION_EASINGS.smooth,
		},
	},
};

export function StaggerItem({ children, className }: StaggerItemProps) {
	const shouldReduceMotion = useReducedMotion();

	// Accesibilidad: sin animaciones si el usuario lo prefiere
	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
}
