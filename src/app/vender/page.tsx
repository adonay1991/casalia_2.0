import {
	ChartLineUp as ChartIcon,
	Handshake as HandshakeIcon,
	HouseLine as HouseIcon,
	MagnifyingGlass as SearchIcon,
	Megaphone as MegaphoneIcon,
	ShieldCheck as ShieldIcon,
	UserCircle as UserIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { ValuationForm } from "./valuation-form";

export const metadata: Metadata = {
	title: "Vender tu propiedad | Casalia Inmobiliaria",
	description:
		"Vende tu propiedad en Parla y alrededores con Casalia. Valoracion gratuita, maxima visibilidad en portales y asesoramiento profesional.",
	openGraph: {
		title: "Vender tu propiedad | Casalia Inmobiliaria",
		description:
			"Vende tu propiedad al mejor precio con valoracion gratuita y sin compromiso.",
	},
};

const BENEFITS = [
	{
		icon: ChartIcon,
		title: "Valoracion profesional",
		description:
			"Analisis de mercado exhaustivo para determinar el precio optimo de tu propiedad.",
	},
	{
		icon: MegaphoneIcon,
		title: "Maxima visibilidad",
		description:
			"Publicacion en los principales portales inmobiliarios: Idealista, Fotocasa y mas.",
	},
	{
		icon: UserIcon,
		title: "Asesoramiento personalizado",
		description:
			"Un agente dedicado te acompana durante todo el proceso de venta.",
	},
	{
		icon: ShieldIcon,
		title: "Seguridad juridica",
		description:
			"Gestionamos toda la documentacion y tramites legales de la venta.",
	},
];

const STEPS = [
	{
		number: "01",
		title: "Solicita valoracion",
		description:
			"Rellena el formulario o contactanos. Un agente visitara tu propiedad para realizar una valoracion gratuita.",
	},
	{
		number: "02",
		title: "Preparamos la venta",
		description:
			"Fotografiamos tu propiedad, redactamos anuncios atractivos y la publicamos en los mejores portales.",
	},
	{
		number: "03",
		title: "Gestionamos visitas",
		description:
			"Organizamos y acompanamos todas las visitas, filtrando compradores serios y cualificados.",
	},
	{
		number: "04",
		title: "Cerramos la operacion",
		description:
			"Negociamos el mejor precio, gestionamos la documentacion y te acompanamos hasta la firma.",
	},
];

export default function VenderPage() {
	return (
		<main>
			{/* Hero Section */}
			<section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
				<div className="container mx-auto px-4 md:px-6">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--casalia-orange)]/10 text-[var(--casalia-orange)] text-sm font-medium mb-6">
								<HouseIcon className="w-4 h-4" />
								Servicio de venta
							</div>
							<h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
								Vende tu propiedad al{" "}
								<span className="text-[var(--casalia-orange)]">mejor precio</span>
							</h1>
							<p className="text-lg text-muted-foreground mb-8">
								En Casalia te ayudamos a vender tu vivienda de forma rapida y segura.
								Valoracion gratuita, maxima difusion en portales y asesoramiento
								profesional durante todo el proceso.
							</p>
							<div className="flex flex-wrap gap-4">
								<div className="flex items-center gap-2 text-sm">
									<SearchIcon className="w-5 h-5 text-[var(--casalia-orange)]" />
									<span>+500 propiedades vendidas</span>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<HandshakeIcon className="w-5 h-5 text-[var(--casalia-orange)]" />
									<span>98% clientes satisfechos</span>
								</div>
							</div>
						</div>
						<div>
							<ValuationForm />
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-16 md:py-20">
				<div className="container mx-auto px-4 md:px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">
							Por que vender con Casalia
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Mas de 15 anos de experiencia en el mercado inmobiliario de Parla y
							alrededores nos avalan.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{BENEFITS.map((benefit) => (
							<div
								key={benefit.title}
								className="p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-shadow"
							>
								<div className="w-12 h-12 rounded-lg bg-[var(--casalia-orange)]/10 flex items-center justify-center mb-4">
									<benefit.icon className="w-6 h-6 text-[var(--casalia-orange)]" />
								</div>
								<h3 className="font-semibold mb-2">{benefit.title}</h3>
								<p className="text-sm text-muted-foreground">
									{benefit.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Process Steps */}
			<section className="py-16 md:py-20 bg-muted/30">
				<div className="container mx-auto px-4 md:px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold mb-4">
							Como funciona el proceso de venta
						</h2>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							Un proceso claro y transparente para que vendas tu propiedad sin
							preocupaciones.
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
						{STEPS.map((step, index) => (
							<div key={step.number} className="relative">
								{/* Connector line */}
								{index < STEPS.length - 1 && (
									<div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-border" />
								)}
								<div className="text-center">
									<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--casalia-orange)] text-white text-xl font-bold mb-4">
										{step.number}
									</div>
									<h3 className="font-semibold mb-2">{step.title}</h3>
									<p className="text-sm text-muted-foreground">
										{step.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 md:py-20">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-3xl mx-auto text-center">
						<h2 className="text-3xl font-bold mb-4">
							Empieza hoy mismo
						</h2>
						<p className="text-muted-foreground mb-8">
							Solicita tu valoracion gratuita y sin compromiso. Nos pondremos en
							contacto contigo en menos de 24 horas.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/vender#"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--casalia-orange)] text-white rounded-lg hover:bg-[var(--casalia-orange-dark)] transition-colors font-medium scroll-smooth"
							>
								<HouseIcon className="w-5 h-5" />
								Solicitar valoracion
							</a>
							<a
								href="https://wa.me/34666666666?text=Hola,%20quiero%20vender%20mi%20propiedad"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
							>
								Contactar por WhatsApp
							</a>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
