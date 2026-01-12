/**
 * Framer Motion Configuration
 * Presets, duraciones y easings para animaciones consistentes
 */

export const MOTION_DURATIONS = {
	fast: 0.15,
	normal: 0.25,
	slow: 0.35,
} as const;

export const MOTION_EASINGS = {
	smooth: [0.25, 0.1, 0.25, 1] as const,
	bounce: [0.68, -0.55, 0.265, 1.55] as const,
	snappy: [0.4, 0, 0.2, 1] as const,
} as const;

export const MOTION_PRESETS = {
	fadeIn: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	},
	fadeInUp: {
		initial: { opacity: 0, y: 20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 20 },
	},
	fadeInDown: {
		initial: { opacity: 0, y: -20 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	},
	fadeInLeft: {
		initial: { opacity: 0, x: -20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -20 },
	},
	fadeInRight: {
		initial: { opacity: 0, x: 20 },
		animate: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 20 },
	},
	scaleIn: {
		initial: { opacity: 0, scale: 0.95 },
		animate: { opacity: 1, scale: 1 },
		exit: { opacity: 0, scale: 0.95 },
	},
} as const;

export const STAGGER_CONFIG = {
	fast: 0.05,
	normal: 0.08,
	slow: 0.12,
} as const;

export type MotionPreset = keyof typeof MOTION_PRESETS;
export type MotionDuration = keyof typeof MOTION_DURATIONS;
export type StaggerSpeed = keyof typeof STAGGER_CONFIG;
