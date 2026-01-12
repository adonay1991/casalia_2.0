import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

import { FadeIn, StaggerItem, StaggerList } from "@/components/motion";
import { AnimatedPropertyCard } from "@/components/property/animated-property-card";
import { Button } from "@/components/ui/button";
import { getFeaturedProperties, getRecentPosts } from "@/lib/db/queries";

// Force dynamic rendering (requires DB at runtime, not build time)
export const dynamic = "force-dynamic";

// Portal logos data
const portals = [
	{ name: "Idealista", logo: "/portals/idealista.png" },
	{ name: "Fotocasa", logo: "/portals/fotocasa.png" },
	{ name: "pisos.com", logo: "/portals/pisos.png" },
	{ name: "Habitaclia", logo: "/portals/habitaclia.png" },
	{ name: "Yaencontre", logo: "/portals/yaencontre.png" },
	{ name: "Milanuncios", logo: "/portals/milanuncios.png" },
];

function formatDate(date: Date | string | null): string {
	if (!date) return "";
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export default async function HomePage() {
	// Fetch real data from database
	const [featuredProperties, recentPosts] = await Promise.all([
		getFeaturedProperties(6),
		getRecentPosts(3),
	]);

	return (
		<>
			{/* Hero Section */}
			<section className="relative bg-gradient-to-br from-[var(--casalia-dark)] to-zinc-800 text-white">
				<div className="container mx-auto px-4 py-20 md:py-32 md:px-6">
					<div className="max-w-3xl mx-auto text-center">
						<FadeIn preset="fadeInUp">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
								Encuentra tu nuevo{" "}
								<span className="text-[var(--casalia-orange)]">HOGAR</span> ideal
							</h1>
						</FadeIn>
						<FadeIn preset="fadeInUp" delay={0.1}>
							<p className="text-xl md:text-2xl text-white/80 mb-8">
								Los mejores inmuebles en venta y alquiler
							</p>
						</FadeIn>

						{/* Search Tabs */}
						<FadeIn preset="fadeInUp" delay={0.2}>
							<div className="bg-white rounded-lg p-2 max-w-2xl mx-auto shadow-xl">
								<div className="flex gap-2 mb-4">
									<Link
										href="/alquilar"
										className="flex-1 py-2 px-4 rounded-md bg-[var(--casalia-orange)] text-white font-medium text-center hover:bg-[var(--casalia-orange-dark)] transition-colors"
									>
										Alquilar
									</Link>
									<Link
										href="/comprar"
										className="flex-1 py-2 px-4 rounded-md text-[var(--casalia-dark)] hover:bg-zinc-100 font-medium text-center transition-colors"
									>
										Comprar
									</Link>
								</div>
								<div className="flex gap-2">
									<input
										type="text"
										placeholder="Buscar por zona, ciudad o codigo postal..."
										className="flex-1 px-4 py-3 rounded-md border border-zinc-200 text-zinc-900 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
									/>
									<Button className="px-6 bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]">
										<SearchIcon className="h-5 w-5" />
									</Button>
								</div>
							</div>
						</FadeIn>
					</div>

					{/* Portal Logos */}
					<div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-70">
						{portals.map((portal) => (
							<div
								key={portal.name}
								className="h-8 w-24 bg-white/20 rounded flex items-center justify-center text-xs text-white/80"
							>
								{portal.name}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Featured Properties Section */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<FadeIn preset="fadeInUp">
						<h2 className="text-3xl font-bold text-center mb-2">
							Encuentra el hogar que buscas
						</h2>
						<p className="text-muted-foreground text-center mb-12">
							Descubre nuestra seleccion de propiedades destacadas
						</p>
					</FadeIn>

					{featuredProperties.length > 0 ? (
						<StaggerList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{featuredProperties.map((property) => (
								<AnimatedPropertyCard key={property.id} property={property} />
							))}
						</StaggerList>
					) : (
						<p className="text-center text-muted-foreground">
							No hay propiedades destacadas en este momento.
						</p>
					)}

					<div className="text-center mt-8">
						<Link
							href="/comprar"
							className="inline-flex items-center gap-2 text-[var(--casalia-orange)] hover:underline font-medium"
						>
							Ver todas las viviendas
							<span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="py-16 bg-zinc-50">
				<div className="container mx-auto px-4 md:px-6">
					<FadeIn preset="fadeInUp">
						<h2 className="text-3xl font-bold text-center mb-12">
							Nuestros servicios
						</h2>
					</FadeIn>

					<StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<StaggerItem>
							<div className="text-center p-6">
								<div className="w-16 h-16 mx-auto mb-4 bg-[var(--casalia-orange)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
									V
								</div>
								<h3 className="text-xl font-semibold mb-2">Vender</h3>
								<p className="text-muted-foreground">
									Te ayudamos a vender tu propiedad al mejor precio y en el menor
									tiempo posible.
								</p>
								<Link
									href="/vender"
									className="inline-block mt-4 text-[var(--casalia-orange)] hover:underline"
								>
									Mas informacion
								</Link>
							</div>
						</StaggerItem>

						<StaggerItem>
							<div className="text-center p-6">
								<div className="w-16 h-16 mx-auto mb-4 bg-[var(--casalia-orange)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
									C
								</div>
								<h3 className="text-xl font-semibold mb-2">Comprar</h3>
								<p className="text-muted-foreground">
									Encuentra la casa de tus suenos con nuestra amplia seleccion de
									propiedades.
								</p>
								<Link
									href="/comprar"
									className="inline-block mt-4 text-[var(--casalia-orange)] hover:underline"
								>
									Ver propiedades
								</Link>
							</div>
						</StaggerItem>

						<StaggerItem>
							<div className="text-center p-6">
								<div className="w-16 h-16 mx-auto mb-4 bg-[var(--casalia-orange)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
									A
								</div>
								<h3 className="text-xl font-semibold mb-2">Alquilar</h3>
								<p className="text-muted-foreground">
									Gestionamos el alquiler de tu vivienda de forma profesional y
									segura.
								</p>
								<Link
									href="/alquilar"
									className="inline-block mt-4 text-[var(--casalia-orange)] hover:underline"
								>
									Ver alquileres
								</Link>
							</div>
						</StaggerItem>
					</StaggerList>
				</div>
			</section>

			{/* Blog Section */}
			<section className="py-16 bg-background">
				<div className="container mx-auto px-4 md:px-6">
					<FadeIn preset="fadeInUp">
						<h2 className="text-3xl font-bold text-center mb-2">
							Nuestras ultimas noticias
						</h2>
						<p className="text-muted-foreground text-center mb-12">
							Mantente al dia con las novedades del mercado inmobiliario
						</p>
					</FadeIn>

					{recentPosts.length > 0 ? (
						<StaggerList className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{recentPosts.map((post) => (
								<StaggerItem key={post.id}>
									<article className="bg-card rounded-lg overflow-hidden border border-border group">
									<Link href={`/blog/${post.slug}`} className="block">
										<div className="h-48 bg-zinc-200 relative overflow-hidden">
											{post.featuredImage ? (
												<Image
													src={post.featuredImage}
													alt={post.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											) : (
												<div className="absolute inset-0 flex items-center justify-center text-zinc-400">
													{post.category || "Blog"}
												</div>
											)}
										</div>
									</Link>
									<div className="p-4">
										{post.category && (
											<span className="text-xs text-[var(--casalia-orange)] font-medium uppercase tracking-wide">
												{post.category}
											</span>
										)}
										<Link href={`/blog/${post.slug}`}>
											<h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[var(--casalia-orange)] transition-colors">
												{post.title}
											</h3>
										</Link>
										{post.excerpt && (
											<p className="text-sm text-muted-foreground line-clamp-3 mb-4">
												{post.excerpt}
											</p>
										)}
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span>{formatDate(post.publishedAt)}</span>
											<Link
												href={`/blog/${post.slug}`}
												className="text-[var(--casalia-orange)] hover:underline font-medium"
											>
												Leer mas
											</Link>
										</div>
									</div>
								</article>
							</StaggerItem>
							))}
						</StaggerList>
					) : (
						<p className="text-center text-muted-foreground">
							No hay articulos publicados todavia.
						</p>
					)}

					<div className="text-center mt-8">
						<Link
							href="/blog"
							className="inline-flex items-center gap-2 text-[var(--casalia-orange)] hover:underline font-medium"
						>
							Todas las noticias
							<span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</div>
			</section>

			{/* Contact Section */}
			<section className="py-16 bg-zinc-50">
				<div className="container mx-auto px-4 md:px-6">
					<FadeIn preset="fadeInUp">
						<h2 className="text-3xl font-bold text-center mb-12">
							Contacta con nosotros
						</h2>
					</FadeIn>

					<div className="max-w-xl mx-auto">
						<form className="space-y-4">
							<div>
								<label
									htmlFor="name"
									className="block text-sm font-medium mb-1"
								>
									Nombre y Apellidos *
								</label>
								<input
									type="text"
									id="name"
									name="name"
									required
									className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
								/>
							</div>
							<div>
								<label
									htmlFor="phone"
									className="block text-sm font-medium mb-1"
								>
									Telefono *
								</label>
								<input
									type="tel"
									id="phone"
									name="phone"
									required
									className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
								/>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium mb-1"
								>
									Correo Electronico *
								</label>
								<input
									type="email"
									id="email"
									name="email"
									required
									className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
								/>
							</div>
							<div>
								<label
									htmlFor="message"
									className="block text-sm font-medium mb-1"
								>
									Mensaje
								</label>
								<textarea
									id="message"
									name="message"
									rows={4}
									className="w-full px-4 py-2 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
								/>
							</div>
							<div className="flex items-start gap-2">
								<input
									type="checkbox"
									id="privacy"
									name="privacy"
									required
									className="mt-1"
								/>
								<label
									htmlFor="privacy"
									className="text-sm text-muted-foreground"
								>
									He leido y acepto la{" "}
									<Link
										href="/privacidad"
										className="text-[var(--casalia-orange)] hover:underline"
									>
										Politica de Privacidad
									</Link>
									. *
								</label>
							</div>
							<Button
								type="submit"
								className="w-full bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]"
							>
								Contactanos
							</Button>
						</form>
					</div>
				</div>
			</section>
		</>
	);
}
