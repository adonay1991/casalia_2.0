import {
	ArrowLeft as ArrowLeftIcon,
	Bathtub as BathtubIcon,
	Bed as BedIcon,
	Calendar as CalendarIcon,
	CarSimple as CarIcon,
	Elevator as ElevatorIcon,
	Fire as FireIcon,
	MapPin as MapPinIcon,
	Phone as PhoneIcon,
	SwimmingPool as PoolIcon,
	Ruler as RulerIcon,
	Snowflake as SnowflakeIcon,
	WhatsappLogo as WhatsappIcon,
} from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PropertyCard } from "@/components/property/property-card";
import { PropertyGallery } from "@/components/property/property-gallery";
import { BreadcrumbSchema, PropertySchema } from "@/components/seo";
import { PropertyMap } from "@/components/shared/property-map";
import { Button } from "@/components/ui/button";
import {
	getAllPropertySlugs,
	getPropertyBySlug,
	getSimilarProperties,
} from "@/lib/db/queries";
import { contactInfo } from "@/types/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casalia.org";

interface PropertyPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const slugs = await getAllPropertySlugs();
	return slugs
		.filter((s) => s.operationType === "alquiler")
		.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
	params,
}: PropertyPageProps): Promise<Metadata> {
	const { slug } = await params;
	const property = await getPropertyBySlug(slug);

	if (!property) {
		return { title: "Propiedad no encontrada" };
	}

	return {
		title: `${property.title} | Alquiler | Casalia`,
		description: property.description.substring(0, 160),
		openGraph: {
			title: property.title,
			description: property.description.substring(0, 160),
			images: property.images?.[0]?.url
				? [{ url: property.images[0].url }]
				: [],
		},
	};
}

function formatPrice(price: string | number): string {
	const numericPrice =
		typeof price === "string" ? Number.parseFloat(price) : price;
	return new Intl.NumberFormat("es-ES", {
		style: "currency",
		currency: "EUR",
		maximumFractionDigits: 0,
	}).format(numericPrice);
}

function getEnergyCertificateColor(cert: string): string {
	const colors: Record<string, string> = {
		A: "bg-green-500",
		B: "bg-green-400",
		C: "bg-lime-400",
		D: "bg-yellow-400",
		E: "bg-orange-400",
		F: "bg-orange-500",
		G: "bg-red-500",
		en_tramite: "bg-gray-400",
		exento: "bg-gray-400",
	};
	return colors[cert] || "bg-gray-400";
}

export default async function PropertyPage({ params }: PropertyPageProps) {
	const { slug } = await params;
	const property = await getPropertyBySlug(slug);

	if (!property) {
		notFound();
	}

	const similarProperties = await getSimilarProperties(property, 3);

	// Features list
	const features = [];
	if (property.hasElevator)
		features.push({ icon: ElevatorIcon, label: "Ascensor" });
	if (property.hasParking) features.push({ icon: CarIcon, label: "Garaje" });
	if (property.hasPool) features.push({ icon: PoolIcon, label: "Piscina" });
	if (property.hasAirConditioning)
		features.push({ icon: SnowflakeIcon, label: "Aire acondicionado" });
	if (property.hasTerrace) features.push({ icon: FireIcon, label: "Terraza" });

	const whatsappMessage = encodeURIComponent(
		`Hola, me interesa el alquiler: ${property.title}. ¿Podrian darme mas informacion?`,
	);
	const whatsappUrl = `https://wa.me/${contactInfo.whatsapp}?text=${whatsappMessage}`;

	return (
		<>
			{/* Schema.org Structured Data */}
			<PropertySchema property={property} images={property.images ?? []} />
			<BreadcrumbSchema
				items={[
					{ name: "Inicio", url: BASE_URL },
					{ name: "Alquilar", url: `${BASE_URL}/alquilar` },
					{ name: property.title, url: `${BASE_URL}/alquilar/${property.slug}` },
				]}
			/>

			<div className="min-h-screen bg-background">
				{/* Breadcrumb */}
				<div className="bg-zinc-50 border-b border-border">
				<div className="container mx-auto px-4 md:px-6 py-3">
					<Link
						href="/alquilar"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						<ArrowLeftIcon className="h-4 w-4" />
						Volver a propiedades en alquiler
					</Link>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 md:px-6 py-8">
				<div className="grid lg:grid-cols-3 gap-8">
					{/* Left Column - Images & Details */}
					<div className="lg:col-span-2 space-y-8">
						{/* Image Gallery with Lightbox */}
						<PropertyGallery
							images={property.images ?? []}
							title={property.title}
							isHighlighted={property.isHighlighted ?? false}
							status={property.status}
						/>

						{/* Property Header */}
						<div>
							<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
								<MapPinIcon className="h-4 w-4" />
								<span>{property.zone || "Parla"}</span>
								{property.address && (
									<>
										<span>•</span>
										<span>{property.address}</span>
									</>
								)}
							</div>
							<h1 className="text-2xl md:text-3xl font-bold mb-4">
								{property.title}
							</h1>
							<p className="text-3xl font-bold text-[var(--casalia-orange)]">
								{formatPrice(property.price)}/mes
							</p>
						</div>

						{/* Quick Stats */}
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-zinc-50 rounded-lg">
							{property.bedrooms !== null && (
								<div className="text-center">
									<BedIcon className="h-6 w-6 mx-auto text-[var(--casalia-orange)] mb-1" />
									<div className="font-semibold">{property.bedrooms}</div>
									<div className="text-xs text-muted-foreground">
										Habitaciones
									</div>
								</div>
							)}
							{property.bathrooms !== null && (
								<div className="text-center">
									<BathtubIcon className="h-6 w-6 mx-auto text-[var(--casalia-orange)] mb-1" />
									<div className="font-semibold">{property.bathrooms}</div>
									<div className="text-xs text-muted-foreground">Banos</div>
								</div>
							)}
							{property.sqmBuilt && (
								<div className="text-center">
									<RulerIcon className="h-6 w-6 mx-auto text-[var(--casalia-orange)] mb-1" />
									<div className="font-semibold">{property.sqmBuilt} m2</div>
									<div className="text-xs text-muted-foreground">
										Construidos
									</div>
								</div>
							)}
							{property.yearBuilt && (
								<div className="text-center">
									<CalendarIcon className="h-6 w-6 mx-auto text-[var(--casalia-orange)] mb-1" />
									<div className="font-semibold">{property.yearBuilt}</div>
									<div className="text-xs text-muted-foreground">
										Ano construccion
									</div>
								</div>
							)}
						</div>

						{/* Description */}
						<div>
							<h2 className="text-xl font-semibold mb-4">Descripcion</h2>
							<div className="prose prose-zinc max-w-none">
								{property.description.split("\n").map((paragraph, i) => (
									<p key={i} className="mb-4 text-muted-foreground">
										{paragraph}
									</p>
								))}
							</div>
						</div>

						{/* Features */}
						{features.length > 0 && (
							<div>
								<h2 className="text-xl font-semibold mb-4">Caracteristicas</h2>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
									{features.map((feature) => (
										<div
											key={feature.label}
											className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg"
										>
											<feature.icon className="h-5 w-5 text-[var(--casalia-orange)]" />
											<span className="text-sm">{feature.label}</span>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Energy Certificate */}
						{property.energyCertificate && (
							<div>
								<h2 className="text-xl font-semibold mb-4">
									Certificado energetico
								</h2>
								<div className="flex items-center gap-3">
									<div
										className={`w-12 h-12 ${getEnergyCertificateColor(property.energyCertificate)} rounded-lg flex items-center justify-center text-white font-bold text-xl`}
									>
										{property.energyCertificate === "en_tramite"
											? "..."
											: property.energyCertificate === "exento"
												? "E"
												: property.energyCertificate}
									</div>
									<span className="text-muted-foreground">
										{property.energyCertificate === "en_tramite"
											? "En tramite"
											: property.energyCertificate === "exento"
												? "Exento"
												: `Calificacion energetica ${property.energyCertificate}`}
									</span>
								</div>
							</div>
						)}

						{/* Map */}
						<div>
							<h2 className="text-xl font-semibold mb-4">Ubicacion</h2>
							{property.lat && property.lng ? (
								<PropertyMap
									lat={Number(property.lat)}
									lng={Number(property.lng)}
									title={property.title}
									address={property.address ?? property.zone ?? undefined}
									className="h-[350px]"
								/>
							) : (
								<div className="h-[200px] bg-zinc-100 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
									<MapPinIcon className="h-8 w-8 mb-2" />
									<span className="text-sm">{property.zone ?? "Parla"}</span>
								</div>
							)}
						</div>
					</div>

					{/* Right Column - Contact Card */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 space-y-6">
							{/* Contact Card */}
							<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
								<h3 className="font-semibold text-lg mb-4">
									Contactar con Casalia
								</h3>

								<div className="space-y-4">
									<a
										href={whatsappUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
									>
										<WhatsappIcon className="h-5 w-5" weight="fill" />
										Contactar por WhatsApp
									</a>

									<a
										href={`tel:${contactInfo.phone}`}
										className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)] text-white rounded-lg font-medium transition-colors"
									>
										<PhoneIcon className="h-5 w-5" />
										{contactInfo.phone}
									</a>
								</div>

								{/* Quick Contact Form */}
								<div className="mt-6 pt-6 border-t border-border">
									<h4 className="font-medium mb-4">O dejanos tus datos</h4>
									<form className="space-y-3">
										<input
											type="text"
											placeholder="Nombre"
											className="w-full px-3 py-2 text-sm rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
										/>
										<input
											type="tel"
											placeholder="Telefono"
											className="w-full px-3 py-2 text-sm rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
										/>
										<input
											type="email"
											placeholder="Email"
											className="w-full px-3 py-2 text-sm rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-[var(--casalia-orange)]"
										/>
										<Button
											type="submit"
											className="w-full bg-[var(--casalia-dark)] hover:bg-zinc-700"
										>
											Solicitar informacion
										</Button>
									</form>
								</div>
							</div>

							{/* Property Details Card */}
							<div className="bg-card border border-border rounded-lg p-6 shadow-sm">
								<h3 className="font-semibold text-lg mb-4">Detalles</h3>
								<dl className="space-y-3 text-sm">
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Referencia</dt>
										<dd className="font-medium">{property.slug}</dd>
									</div>
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Tipo</dt>
										<dd className="font-medium capitalize">
											{property.propertyType}
										</dd>
									</div>
									{property.sqmBuilt && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">m2 construidos</dt>
											<dd className="font-medium">{property.sqmBuilt} m2</dd>
										</div>
									)}
									{property.sqmUseful && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">m2 utiles</dt>
											<dd className="font-medium">{property.sqmUseful} m2</dd>
										</div>
									)}
									{property.floor && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Planta</dt>
											<dd className="font-medium">{property.floor}</dd>
										</div>
									)}
									{property.communityFee && (
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Comunidad</dt>
											<dd className="font-medium">
												{formatPrice(property.communityFee)}/mes
											</dd>
										</div>
									)}
									{/* Rental specific: deposit */}
									<div className="flex justify-between">
										<dt className="text-muted-foreground">Fianza</dt>
										<dd className="font-medium">
											{formatPrice(Number(property.price) * 2)} (2 meses)
										</dd>
									</div>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Similar Properties */}
			{similarProperties.length > 0 && (
				<section className="bg-zinc-50 py-12">
					<div className="container mx-auto px-4 md:px-6">
						<h2 className="text-2xl font-bold mb-8">Alquileres similares</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{similarProperties.map((prop) => (
								<PropertyCard
									key={prop.id}
									property={prop}
									variant="alquilar"
								/>
							))}
						</div>
					</div>
				</section>
			)}
			</div>
		</>
	);
}
