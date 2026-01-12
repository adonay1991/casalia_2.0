import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Aviso Legal | Casalia Inmobiliaria",
	description:
		"Aviso legal y condiciones de uso del sitio web de Casalia Inmobiliaria.",
};

export default function AvisoLegalPage() {
	return (
		<main className="container mx-auto px-4 py-16 md:px-6 max-w-3xl">
			<h1 className="text-4xl font-bold mb-8">Aviso Legal</h1>

			<div className="prose prose-zinc max-w-none space-y-8">
				<section>
					<h2 className="text-2xl font-semibold mb-4">
						1. Datos identificativos
					</h2>
					<p className="text-muted-foreground mb-4">
						En cumplimiento del articulo 10 de la Ley 34/2002, de 11 de julio,
						de Servicios de la Sociedad de la Informacion y Comercio
						Electronico, se informa a los usuarios de los datos del titular de
						este sitio web:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Denominacion social:</strong> Casalia Inmobiliaria S.L.
						</li>
						<li>
							<strong>CIF:</strong> B-XXXXXXXX
						</li>
						<li>
							<strong>Domicilio social:</strong> Calle Principal, 123, 28981
							Parla, Madrid
						</li>
						<li>
							<strong>Telefono:</strong> 91 XXX XX XX
						</li>
						<li>
							<strong>Email:</strong> info@casalia.org
						</li>
						<li>
							<strong>Registro Mercantil:</strong> Inscrita en el Registro
							Mercantil de Madrid
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">2. Objeto</h2>
					<p className="text-muted-foreground">
						El presente aviso legal regula el uso del sitio web casalia.org (en
						adelante, el "Sitio Web") del que es titular Casalia Inmobiliaria
						S.L. La navegacion por el Sitio Web atribuye la condicion de usuario
						del mismo e implica la aceptacion plena y sin reservas de todas y
						cada una de las disposiciones incluidas en este Aviso Legal.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						3. Condiciones de uso
					</h2>
					<p className="text-muted-foreground mb-4">
						El usuario se compromete a hacer un uso adecuado de los contenidos y
						servicios que Casalia Inmobiliaria ofrece a traves de su sitio web
						y, a titulo enunciativo pero no limitativo, a no emplearlos para:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							Difundir contenidos delictivos, violentos, pornograficos,
							racistas, xenofobos, ofensivos o de apologia del terrorismo.
						</li>
						<li>
							Introducir en la red virus informaticos o realizar actuaciones
							susceptibles de alterar, estropear, interrumpir o generar errores
							en los documentos, archivos y sistemas informaticos.
						</li>
						<li>
							Intentar acceder a areas restringidas de los sistemas informaticos
							de Casalia Inmobiliaria o de terceros.
						</li>
						<li>
							Vulnerar los derechos de propiedad intelectual o industrial.
						</li>
						<li>
							Suplantar la identidad de otro usuario o de terceros.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						4. Propiedad intelectual e industrial
					</h2>
					<p className="text-muted-foreground">
						Todos los contenidos del Sitio Web, incluyendo sin caracter
						limitativo, textos, fotografias, graficos, imagenes, iconos,
						tecnologia, software, enlaces y demas contenidos audiovisuales, asi
						como su diseno grafico y codigos fuente, son propiedad intelectual
						de Casalia Inmobiliaria o de terceros, sin que puedan entenderse
						cedidos al usuario ninguno de los derechos de explotacion
						reconocidos por la normativa vigente.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						5. Exclusion de garantias y responsabilidad
					</h2>
					<p className="text-muted-foreground mb-4">
						Casalia Inmobiliaria no se hace responsable, en ningun caso, de los
						danos y perjuicios de cualquier naturaleza que pudieran ocasionar, a
						titulo enunciativo:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							Errores u omisiones en los contenidos, falta de disponibilidad del
							portal o la transmision de virus o programas maliciosos.
						</li>
						<li>
							El uso ilicito, negligente, fraudulento o contrario a este Aviso
							Legal.
						</li>
						<li>
							La falta de licitud, calidad, fiabilidad, utilidad y
							disponibilidad de los servicios prestados por terceros.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">6. Enlaces externos</h2>
					<p className="text-muted-foreground">
						El Sitio Web puede contener enlaces a sitios web de terceros.
						Casalia Inmobiliaria no asume ninguna responsabilidad por el
						contenido, informaciones o servicios que pudieran aparecer en dichos
						sitios, que tendran exclusivamente caracter informativo.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						7. Legislacion aplicable
					</h2>
					<p className="text-muted-foreground">
						Para la resolucion de todas las controversias o cuestiones
						relacionadas con el presente Sitio Web o de las actividades en el
						desarrolladas, sera de aplicacion la legislacion espanola, a la que
						se someten expresamente las partes. Para la resolucion de cualquier
						litigio derivado del presente Aviso Legal, las partes se someten a
						los Juzgados y Tribunales de Madrid.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						8. Modificaciones del aviso legal
					</h2>
					<p className="text-muted-foreground">
						Casalia Inmobiliaria se reserva el derecho a realizar las
						modificaciones que considere oportunas en su sitio web, pudiendo
						cambiar, suprimir o anadir tanto los contenidos y servicios que
						presta como la forma en la que estos aparezcan presentados o
						localizados.
					</p>
				</section>

				<div className="mt-12 p-4 bg-muted rounded-lg">
					<p className="text-sm text-muted-foreground">
						<strong>Ultima actualizacion:</strong> Enero 2026
					</p>
				</div>
			</div>
		</main>
	);
}
