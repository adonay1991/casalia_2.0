import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Team Casalia",
	description:
		"Conoce al equipo de profesionales de Casalia Inmobiliaria en Parla.",
};

export default function TeamCasaliaPage() {
	return (
		<div className="container mx-auto px-4 py-16 md:px-6">
			<h1 className="text-4xl font-bold mb-4">Team Casalia</h1>
			<p className="text-muted-foreground text-lg mb-8">
				Conoce a nuestro equipo de profesionales.
			</p>
			{/* TODO: Add team members */}
		</div>
	);
}
