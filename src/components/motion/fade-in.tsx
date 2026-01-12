"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import {
	MOTION_DURATIONS,
	MOTION_EASINGS,
	MOTION_PRESETS,
	type MotionDuration,
	type MotionPreset,
} from "./motion-config";

interface FadeInProps {
	children: ReactNode;
	preset?: MotionPreset;
	duration?: MotionDuration;
	delay?: number;
	className?: string;
	once?: boolean;
	amount?: number | "some" | "all";
}

export function FadeIn({
	children,
	preset = "fadeIn",
	duration = "normal",
	delay = 0,
	className,
	once = true,
	amount = 0.3,
}: FadeInProps) {
	const shouldReduceMotion = useReducedMotion();

	// Accesibilidad: sin animaciones si el usuario lo prefiere
	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	const motionPreset = MOTION_PRESETS[preset];
	const durationValue = MOTION_DURATIONS[duration];

	return (
		<motion.div
			initial={motionPreset.initial}
			whileInView={motionPreset.animate}
			viewport={{ once, amount }}
			transition={{
				duration: durationValue,
				delay,
				ease: MOTION_EASINGS.smooth,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}
