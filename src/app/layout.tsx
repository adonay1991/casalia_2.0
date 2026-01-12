import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer, Header } from "@/components/layout";
import { PageTransition } from "@/components/motion";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo";
import { WhatsAppButton } from "@/components/shared";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Casalia Inmobiliaria | Parla",
		template: "%s | Casalia Inmobiliaria",
	},
	description:
		"Tu inmobiliaria de confianza en Parla. Compra, venta y alquiler de pisos, casas y locales. Encuentra tu nuevo hogar ideal con Casalia.",
	keywords: [
		"inmobiliaria",
		"parla",
		"pisos",
		"casas",
		"alquiler",
		"venta",
		"madrid",
		"propiedades",
	],
	authors: [{ name: "Casalia Inmobiliaria" }],
	creator: "Casalia",
	openGraph: {
		type: "website",
		locale: "es_ES",
		url: "https://www.casalia.org",
		siteName: "Casalia Inmobiliaria",
		title: "Casalia Inmobiliaria | Tu hogar ideal en Parla",
		description:
			"Encuentra pisos, casas y locales en venta y alquiler en Parla y alrededores.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Casalia Inmobiliaria | Parla",
		description:
			"Tu inmobiliaria de confianza en Parla. Compra, venta y alquiler de propiedades.",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es">
			<head>
				<OrganizationSchema />
				<WebSiteSchema />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
			>
				<Header />
				<main className="flex-1">
					<PageTransition>{children}</PageTransition>
				</main>
				<Footer />
				<WhatsAppButton />
			</body>
		</html>
	);
}
