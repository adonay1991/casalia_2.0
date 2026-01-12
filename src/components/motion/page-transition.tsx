"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { MOTION_DURATIONS, MOTION_EASINGS } from "./motion-config";

interface PageTransitionProps {
	children: ReactNode;
}

const pageVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export function PageTransition({ children }: PageTransitionProps) {
	const pathname = usePathname();
	const shouldReduceMotion = useReducedMotion();

	// Accesibilidad: sin animaciones si el usuario lo prefiere
	if (shouldReduceMotion) {
		return <>{children}</>;
	}

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={pathname}
				initial="initial"
				animate="animate"
				exit="exit"
				variants={pageVariants}
				transition={{
					duration: MOTION_DURATIONS.normal,
					ease: MOTION_EASINGS.smooth,
				}}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
}
