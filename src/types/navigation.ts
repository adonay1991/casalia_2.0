export interface NavItem {
	label: string;
	href: string;
	children?: NavItem[];
}

export const mainNavItems: NavItem[] = [
	{ label: "Vender", href: "/vender" },
	{ label: "Comprar", href: "/comprar" },
	{ label: "Alquilar", href: "/alquilar" },
	{ label: "Blog Inmobiliario", href: "/blog" },
	{ label: "Team Casalia", href: "/team-casalia" },
];

export const footerNavItems = {
	info: [
		{ label: "Vender", href: "/vender" },
		{ label: "Comprar", href: "/comprar" },
		{ label: "Alquilar", href: "/alquilar" },
		{ label: "Blog Inmobiliario", href: "/blog" },
		{ label: "Team Casalia", href: "/team-casalia" },
	],
	legal: [
		{ label: "Proteccin de datos", href: "/proteccion-de-datos" },
		{ label: "Poltica de privacidad", href: "/privacidad" },
		{ label: "Poltica de cookies", href: "/cookies" },
	],
};

export const contactInfo = {
	email: "inmobiliaria@casalia.org",
	phone: "+34 911 522 086",
	phoneDisplay: "911 522 086",
	whatsapp: "+34911522086",
	address: "Calle Real, N 23 (28982) Parla, Madrid",
	googleMapsUrl:
		"https://www.google.com/maps/place/Calle+Real,+23,+28981+Parla,+Madrid",
	social: {
		facebook: "https://www.facebook.com/casaliainmobiliaria",
		instagram: "https://www.instagram.com/casaliainmobiliaria",
		twitter: "https://twitter.com/casalia",
		linkedin: "https://www.linkedin.com/company/casalia",
	},
};
