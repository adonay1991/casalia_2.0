"use client";

import { WhatsappLogo as WhatsappIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { contactInfo } from "@/types/navigation";

interface WhatsAppButtonProps {
	message?: string;
	className?: string;
}

export function WhatsAppButton({
	message = "Hola, me gustaria obtener informacion sobre sus propiedades",
	className,
}: WhatsAppButtonProps) {
	const whatsappNumber = contactInfo.whatsapp.replace(/\D/g, "");
	const encodedMessage = encodeURIComponent(message);
	const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
	const shouldReduceMotion = useReducedMotion();

	return (
		<motion.a
			href={whatsappUrl}
			target="_blank"
			rel="noopener noreferrer"
			aria-label="Contactar por WhatsApp"
			initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{
				type: "spring",
				stiffness: 260,
				damping: 20,
				delay: 0.5,
			}}
			whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
			whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
			className={cn(
				"fixed bottom-6 right-6 z-50",
				"flex items-center justify-center",
				"h-14 w-14 rounded-full",
				"bg-[#25D366] text-white shadow-lg",
				"focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2",
				className,
			)}
		>
			<WhatsappIcon className="h-7 w-7" weight="fill" />
		</motion.a>
	);
}
