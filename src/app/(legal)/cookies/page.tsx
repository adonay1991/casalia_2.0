import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Politica de Cookies | Casalia Inmobiliaria",
	description:
		"Informacion sobre el uso de cookies en el sitio web de Casalia Inmobiliaria.",
};

export default function CookiesPage() {
	return (
		<main className="container mx-auto px-4 py-16 md:px-6 max-w-3xl">
			<h1 className="text-4xl font-bold mb-8">Politica de Cookies</h1>

			<div className="prose prose-zinc max-w-none space-y-8">
				<section>
					<h2 className="text-2xl font-semibold mb-4">1. Que son las cookies</h2>
					<p className="text-muted-foreground">
						Las cookies son pequenos archivos de texto que los sitios web
						almacenan en su dispositivo (ordenador, tablet, smartphone) cuando
						los visita. Estas cookies permiten que el sitio web recuerde sus
						acciones y preferencias durante un periodo de tiempo, para que no
						tenga que volver a introducirlas cada vez que visite el sitio o
						navegue de una pagina a otra.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						2. Tipos de cookies que utilizamos
					</h2>
					<p className="text-muted-foreground mb-4">
						En nuestro sitio web utilizamos los siguientes tipos de cookies:
					</p>

					<div className="space-y-4">
						<div className="p-4 border border-border rounded-lg">
							<h3 className="font-semibold mb-2">Cookies tecnicas (necesarias)</h3>
							<p className="text-sm text-muted-foreground mb-2">
								Son esenciales para el funcionamiento del sitio web. Permiten
								navegar por la web y utilizar sus funciones basicas.
							</p>
							<ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
								<li>
									<strong>Sesion:</strong> Mantienen su sesion activa mientras
									navega por el sitio.
								</li>
								<li>
									<strong>Autenticacion:</strong> Recuerdan si ha iniciado sesion
									en el panel de administracion.
								</li>
								<li>
									<strong>Seguridad:</strong> Protegen contra ataques CSRF y
									otros riesgos de seguridad.
								</li>
							</ul>
						</div>

						<div className="p-4 border border-border rounded-lg">
							<h3 className="font-semibold mb-2">Cookies de preferencias</h3>
							<p className="text-sm text-muted-foreground mb-2">
								Permiten recordar sus preferencias y personalizar su experiencia.
							</p>
							<ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
								<li>
									<strong>Tema:</strong> Recuerdan si prefiere el modo claro u
									oscuro.
								</li>
								<li>
									<strong>Idioma:</strong> Guardan sus preferencias de idioma.
								</li>
								<li>
									<strong>Filtros:</strong> Recuerdan los filtros de busqueda
									que ha aplicado.
								</li>
							</ul>
						</div>

						<div className="p-4 border border-border rounded-lg">
							<h3 className="font-semibold mb-2">Cookies analiticas</h3>
							<p className="text-sm text-muted-foreground mb-2">
								Nos ayudan a entender como los visitantes interactuan con el
								sitio web, permitiendonos mejorar su funcionamiento.
							</p>
							<ul className="text-sm text-muted-foreground list-disc pl-6 space-y-1">
								<li>
									<strong>Google Analytics:</strong> Recopila informacion
									anonima sobre las visitas al sitio.
								</li>
								<li>
									<strong>Estadisticas:</strong> Numero de visitantes, paginas
									mas vistas, tiempo de permanencia.
								</li>
							</ul>
						</div>
					</div>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						3. Cookies de terceros
					</h2>
					<p className="text-muted-foreground mb-4">
						Nuestro sitio web puede incluir cookies de terceros servicios:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Google Analytics:</strong> Para analisis de trafico web.
							Puede consultar su politica de privacidad en{" "}
							<a
								href="https://policies.google.com/privacy"
								target="_blank"
								rel="noopener noreferrer"
								className="text-[var(--casalia-orange)] hover:underline"
							>
								policies.google.com/privacy
							</a>
						</li>
						<li>
							<strong>Google Maps:</strong> Para mostrar la ubicacion de
							propiedades en mapas interactivos.
						</li>
						<li>
							<strong>Supabase:</strong> Para la gestion de autenticacion y base
							de datos.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						4. Duracion de las cookies
					</h2>
					<p className="text-muted-foreground mb-4">
						Segun su duracion, las cookies pueden ser:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Cookies de sesion:</strong> Se eliminan automaticamente al
							cerrar el navegador.
						</li>
						<li>
							<strong>Cookies persistentes:</strong> Permanecen en su dispositivo
							durante un periodo determinado (desde dias hasta anos) o hasta que
							las elimine manualmente.
						</li>
					</ul>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						5. Como gestionar las cookies
					</h2>
					<p className="text-muted-foreground mb-4">
						Puede configurar su navegador para aceptar, rechazar o eliminar
						cookies. A continuacion le indicamos como hacerlo en los navegadores
						mas comunes:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-muted-foreground">
						<li>
							<strong>Google Chrome:</strong> Configuracion → Privacidad y
							seguridad → Cookies y otros datos de sitios
						</li>
						<li>
							<strong>Mozilla Firefox:</strong> Opciones → Privacidad y
							seguridad → Cookies y datos del sitio
						</li>
						<li>
							<strong>Safari:</strong> Preferencias → Privacidad → Gestionar
							datos de sitios web
						</li>
						<li>
							<strong>Microsoft Edge:</strong> Configuracion → Privacidad,
							busqueda y servicios → Cookies
						</li>
					</ul>
					<p className="text-muted-foreground mt-4">
						Tenga en cuenta que si bloquea todas las cookies, algunas funciones
						del sitio web pueden no estar disponibles o funcionar correctamente.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						6. Consentimiento de cookies
					</h2>
					<p className="text-muted-foreground">
						Al acceder a nuestro sitio web por primera vez, se le mostrara un
						banner de cookies donde podra aceptar o rechazar el uso de cookies
						no esenciales. Puede modificar sus preferencias en cualquier momento
						a traves del enlace &quot;Configurar cookies&quot; en el pie de pagina de
						nuestro sitio web.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">
						7. Actualizaciones de esta politica
					</h2>
					<p className="text-muted-foreground">
						Podemos actualizar esta politica de cookies periodicamente para
						reflejar cambios en las cookies que utilizamos o por otras razones
						operativas, legales o reglamentarias. Le recomendamos revisar esta
						pagina regularmente para estar informado sobre el uso de cookies.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">8. Mas informacion</h2>
					<p className="text-muted-foreground">
						Para mas informacion sobre como tratamos sus datos personales,
						consulte nuestra{" "}
						<a
							href="/privacidad"
							className="text-[var(--casalia-orange)] hover:underline"
						>
							Politica de Privacidad
						</a>
						. Si tiene alguna pregunta sobre nuestra politica de cookies, puede
						contactarnos en{" "}
						<strong>info@casalia.org</strong>.
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
