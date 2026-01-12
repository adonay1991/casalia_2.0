import {
	Envelope as EnvelopeIcon,
	FacebookLogo as FacebookIcon,
	InstagramLogo as InstagramIcon,
	LinkedinLogo as LinkedinIcon,
	MapPin as MapPinIcon,
	Phone as PhoneIcon,
	XLogo as XIcon,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { contactInfo, footerNavItems } from "@/types/navigation";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-[var(--casalia-orange)] text-white">
			<div className="container mx-auto px-4 py-12 md:px-6">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{/* Logo & Contact */}
					<div className="space-y-4">
						<Link href="/" className="inline-block">
							<span className="font-bold text-2xl text-white">CASALIA</span>
						</Link>
						<ul className="space-y-3 mt-4">
							<li className="flex items-center gap-2">
								<EnvelopeIcon className="h-5 w-5 flex-shrink-0" />
								<a
									href={`mailto:${contactInfo.email}`}
									className="hover:underline"
								>
									{contactInfo.email}
								</a>
							</li>
							<li className="flex items-center gap-2">
								<PhoneIcon className="h-5 w-5 flex-shrink-0" />
								<a
									href={`tel:${contactInfo.phone}`}
									className="hover:underline"
								>
									{contactInfo.phoneDisplay}
								</a>
							</li>
							<li className="flex items-start gap-2">
								<MapPinIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
								<a
									href={contactInfo.googleMapsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:underline"
								>
									{contactInfo.address}
								</a>
							</li>
						</ul>
						{/* Social Icons */}
						<div className="flex gap-3 pt-2">
							<a
								href={contactInfo.social.facebook}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
								className="hover:opacity-80 transition-opacity"
							>
								<FacebookIcon className="h-6 w-6" />
							</a>
							<a
								href={contactInfo.social.instagram}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
								className="hover:opacity-80 transition-opacity"
							>
								<InstagramIcon className="h-6 w-6" />
							</a>
							<a
								href={contactInfo.social.twitter}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="X (Twitter)"
								className="hover:opacity-80 transition-opacity"
							>
								<XIcon className="h-6 w-6" />
							</a>
							<a
								href={contactInfo.social.linkedin}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="LinkedIn"
								className="hover:opacity-80 transition-opacity"
							>
								<LinkedinIcon className="h-6 w-6" />
							</a>
						</div>
					</div>

					{/* Mas Informacion */}
					<div>
						<h3 className="font-bold text-lg mb-4">Mas informacion</h3>
						<ul className="space-y-2">
							{footerNavItems.info.map((item) => (
								<li key={item.href}>
									<Link href={item.href} className="hover:underline">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Informacion Legal */}
					<div>
						<h3 className="font-bold text-lg mb-4">Informacion Legal</h3>
						<ul className="space-y-2">
							{footerNavItems.legal.map((item) => (
								<li key={item.href}>
									<Link href={item.href} className="hover:underline">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Horario */}
					<div>
						<h3 className="font-bold text-lg mb-4">Horario de atencion</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<span className="font-medium">Lunes - Viernes:</span>
								<br />
								10:00 - 14:00 / 17:00 - 20:00
							</li>
							<li>
								<span className="font-medium">Sabados:</span>
								<br />
								10:00 - 14:00
							</li>
							<li>
								<span className="font-medium">Domingos:</span>
								<br />
								Cerrado
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Copyright */}
			<div className="border-t border-white/20">
				<div className="container mx-auto px-4 py-4 md:px-6">
					<p className="text-center text-sm">
						&copy;{currentYear} Casalia Inmobiliaria. Todos los derechos
						reservados.
					</p>
				</div>
			</div>
		</footer>
	);
}
