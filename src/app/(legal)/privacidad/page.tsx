import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Politica de Privacidad | Casalia Inmobiliaria",
	description:
		"Politica de privacidad y proteccion de datos de Casalia Inmobiliaria.",
};

export default function PrivacidadPage() {
	return (
		<main className="container mx-auto px-4 py-16 md:px-6 max-w-3xl">
			<h1 className="text-4xl font-bold mb-8">Politica de Privacidad</h1>

			<div className="prose prose-zinc max-w-none space-y-8">
				<section>
					<h2 className="text-2xl font-semibold mb-4">
						1. Responsable del tratamiento
					</h2>
					<p className="text-muted-foreground mb-4">
						En cumplimiento del Reglamento (UE) 2016/679 General de Proteccion
						de Datos (RGPD) y la Ley Organica 3/2018, de 5 de diciembre, de
						Proteccion de Datos Personales y garantia de los derechos digitales
						(LOPDGDD), le informamos que:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Responsable:</strong> Casalia Inmobiliaria S.L.
						</li>
						<li>
							<strong>CIF:</strong> B-XXXXXXXX
						</li>
						<li>
							<strong>Domicilio:</strong> Calle Principal, 123, 28981 Parla,
							Madrid
						</li>
						<li>
							<strong>Email:</strong> privacidad@casalia.org
						</li>
						<li>
							<strong>Telefono:</strong> 91 XXX XX XX
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						2. Finalidades del tratamiento
					</h2>
					<p className="text-muted-foreground mb-4">
						Los datos personales que nos proporcione seran tratados con las
						siguientes finalidades:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Gestion de consultas:</strong> Atender y responder a las
							consultas realizadas a traves del formulario de contacto o
							WhatsApp.
						</li>
						<li>
							<strong>Servicios inmobiliarios:</strong> Gestionar la compra,
							venta o alquiler de inmuebles, incluyendo la busqueda de
							propiedades que se ajusten a sus preferencias.
						</li>
						<li>
							<strong>Valoraciones:</strong> Realizar valoraciones de
							propiedades a solicitud del interesado.
						</li>
						<li>
							<strong>Comunicaciones comerciales:</strong> Enviar informacion
							sobre propiedades y servicios que puedan ser de su interes, previo
							consentimiento.
						</li>
						<li>
							<strong>Gestion de clientes:</strong> Administrar la relacion
							comercial con nuestros clientes.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						3. Legitimacion del tratamiento
					</h2>
					<p className="text-muted-foreground mb-4">
						La base legal para el tratamiento de sus datos es:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Consentimiento:</strong> Para el envio de comunicaciones
							comerciales y newsletters.
						</li>
						<li>
							<strong>Ejecucion de contrato:</strong> Para la prestacion de
							servicios inmobiliarios cuando exista una relacion contractual.
						</li>
						<li>
							<strong>Interes legitimo:</strong> Para la gestion de consultas y
							la mejora de nuestros servicios.
						</li>
						<li>
							<strong>Obligacion legal:</strong> Para el cumplimiento de
							obligaciones legales aplicables.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						4. Destinatarios de los datos
					</h2>
					<p className="text-muted-foreground mb-4">
						Sus datos podran ser comunicados a:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Portales inmobiliarios:</strong> Idealista, Fotocasa y
							otros portales para la publicacion de inmuebles (con su
							consentimiento).
						</li>
						<li>
							<strong>Entidades financieras:</strong> Para la gestion de
							hipotecas y financiacion (solo si lo solicita).
						</li>
						<li>
							<strong>Administraciones Publicas:</strong> Cuando exista
							obligacion legal.
						</li>
						<li>
							<strong>Proveedores de servicios:</strong> Hosting, email y otras
							herramientas necesarias para la prestacion del servicio.
						</li>
					</ul>
					<p className="text-muted-foreground mt-4">
						No se realizan transferencias internacionales de datos fuera del
						Espacio Economico Europeo.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						5. Conservacion de los datos
					</h2>
					<p className="text-muted-foreground">
						Los datos personales se conservaran durante el tiempo necesario para
						cumplir con la finalidad para la que fueron recabados y para
						determinar las posibles responsabilidades derivadas. Los datos de
						clientes se conservaran mientras dure la relacion comercial y,
						posteriormente, durante el plazo de prescripcion de las acciones
						legales que pudieran derivarse.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						6. Derechos del interesado
					</h2>
					<p className="text-muted-foreground mb-4">
						Usted tiene derecho a:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Acceso:</strong> Obtener confirmacion de si estamos
							tratando sus datos y acceder a los mismos.
						</li>
						<li>
							<strong>Rectificacion:</strong> Solicitar la modificacion de datos
							inexactos o incompletos.
						</li>
						<li>
							<strong>Supresion:</strong> Solicitar la eliminacion de sus datos
							cuando ya no sean necesarios.
						</li>
						<li>
							<strong>Oposicion:</strong> Oponerse al tratamiento de sus datos
							en determinadas circunstancias.
						</li>
						<li>
							<strong>Limitacion:</strong> Solicitar la limitacion del
							tratamiento en determinados casos.
						</li>
						<li>
							<strong>Portabilidad:</strong> Recibir sus datos en formato
							estructurado y transmitirlos a otro responsable.
						</li>
						<li>
							<strong>Retirar el consentimiento:</strong> Retirar el
							consentimiento prestado en cualquier momento.
						</li>
					</ul>
					<p className="text-muted-foreground mt-4">
						Para ejercer estos derechos, puede enviar un correo a{" "}
						<strong>privacidad@casalia.org</strong> adjuntando copia de su DNI.
						Tambien tiene derecho a presentar una reclamacion ante la Agencia
						Espanola de Proteccion de Datos (www.aepd.es).
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						7. Datos de menores
					</h2>
					<p className="text-muted-foreground">
						Nuestros servicios no estan dirigidos a menores de 14 anos. Si es
						menor de dicha edad, debera contar con el consentimiento de sus
						padres o tutores legales para facilitarnos sus datos personales.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						8. Medidas de seguridad
					</h2>
					<p className="text-muted-foreground">
						Casalia Inmobiliaria ha adoptado las medidas tecnicas y
						organizativas necesarias para garantizar la seguridad de los datos
						personales y evitar su alteracion, perdida, tratamiento o acceso no
						autorizado. Entre estas medidas se incluyen el cifrado de
						comunicaciones, copias de seguridad periodicas y control de acceso a
						los sistemas.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						9. Modificaciones de la politica
					</h2>
					<p className="text-muted-foreground">
						Casalia Inmobiliaria se reserva el derecho a modificar la presente
						politica de privacidad para adaptarla a novedades legislativas o
						jurisprudenciales. En caso de cambios significativos, se lo
						comunicaremos a traves de nuestro sitio web o por correo
						electronico.
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
