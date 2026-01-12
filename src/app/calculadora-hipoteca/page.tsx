import { Calculator as CalculatorIcon } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";

import { MortgageCalculator } from "@/components/shared/mortgage-calculator";

export const metadata: Metadata = {
	title: "Calculadora de Hipoteca | Casalia Inmobiliaria",
	description:
		"Calcula tu hipoteca de forma sencilla. Conoce cuanto puedes pagar al mes y planifica la compra de tu nueva vivienda en Parla.",
	openGraph: {
		title: "Calculadora de Hipoteca | Casalia Inmobiliaria",
		description:
			"Calcula tu cuota mensual de hipoteca y planifica la compra de tu vivienda.",
	},
};

export default function CalculadoraHipotecaPage() {
	return (
		<main className="container mx-auto px-4 py-12 md:px-6">
			{/* Header */}
			<div className="max-w-3xl mx-auto text-center mb-12">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--casalia-orange)]/10 text-[var(--casalia-orange)] mb-6">
					<CalculatorIcon className="h-8 w-8" />
				</div>
				<h1 className="text-4xl font-bold mb-4">Calculadora de Hipoteca</h1>
				<p className="text-lg text-muted-foreground">
					Calcula tu cuota mensual estimada y planifica la compra de tu nueva
					vivienda. Ajusta los parametros segun tus necesidades.
				</p>
			</div>

			{/* Calculator */}
			<div className="max-w-4xl mx-auto">
				<MortgageCalculator />
			</div>

			{/* CTA Section */}
			<div className="max-w-3xl mx-auto mt-16 text-center">
				<h2 className="text-2xl font-semibold mb-4">
					¿Necesitas ayuda con tu hipoteca?
				</h2>
				<p className="text-muted-foreground mb-6">
					En Casalia te ayudamos a encontrar la mejor financiacion para tu
					vivienda. Trabajamos con las principales entidades bancarias para
					ofrecerte las mejores condiciones.
				</p>
				<a
					href="https://wa.me/34666666666?text=Hola,%20me%20gustaria%20informacion%20sobre%20financiacion%20hipotecaria"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 bg-[var(--casalia-orange)] text-white px-6 py-3 rounded-lg hover:bg-[var(--casalia-orange-dark)] transition-colors font-medium"
				>
					Contactar por WhatsApp
				</a>
			</div>
		</main>
	);
}
