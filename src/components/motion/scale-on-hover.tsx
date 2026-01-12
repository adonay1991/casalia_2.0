"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface ScaleOnHoverProps {
	children: ReactNode;
	scale?: number;
	className?: string;
}

export function ScaleOnHover({
	children,
	scale = 1.02,
	className,
}: ScaleOnHoverProps) {
	const shouldReduceMotion = useReducedMotion();

	// Accesibilidad: sin animaciones si el usuario lo prefiere
	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			whileHover={{ scale }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.15, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
