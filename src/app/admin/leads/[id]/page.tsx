import {
	ArrowLeft as BackIcon,
	EnvelopeSimple as EmailIcon,
	Phone as PhoneIcon,
	House as PropertyIcon,
	WhatsappLogo as WhatsappIcon,
} from "@phosphor-icons/react/ssr";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { contactInfo } from "@/types/navigation";
import { updateLeadStatus } from "./actions";

export const metadata: Metadata = {
	title: "Detalle de Lead | Casalia Admin",
	description: "Ver y gestionar un lead",
};

interface LeadDetailPageProps {
	params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
	const { id } = await params;
	const user = await getCurrentUser();

	if (!user) {
		redirect("/auth/login");
	}

	const lead = await db.query.leads.findFirst({
		where: eq(leads.id, id),
		with: {
			property: true,
		},
	});

	if (!lead) {
		notFound();
	}

	const whatsappMessage = encodeURIComponent(
		`Hola ${lead.name}, le contactamos de Casalia respecto a su consulta.`,
	);
	const whatsappUrl = lead.phone
		? `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${whatsappMessage}`
		: null;

	return (
		<>
			<AdminHeader
				title="Detalle de Lead"
				user={{
					name: user.name,
					email: user.email,
					role: user.role,
					avatarUrl: user.avatarUrl,
				}}
			/>

			<main className="p-4 md:p-6">
				<div className="mb-6">
					<Link href="/admin/leads">
						<Button variant="ghost" size="sm" className="gap-2">
							<BackIcon className="h-4 w-4" />
							Volver a leads
						</Button>
					</Link>
				</div>

				<div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
					{/* Main info */}
					<div className="lg:col-span-2 space-y-6">
						<Card className="p-6">
							<div className="flex items-start justify-between mb-6">
								<div>
									<h2 className="text-2xl font-bold">{lead.name}</h2>
									<p className="text-muted-foreground">
										{formatDate(lead.createdAt)}
									</p>
								</div>
								<StatusBadge status={lead.status} />
							</div>

							<div className="grid sm:grid-cols-2 gap-4">
								{lead.email && (
									<div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
										<EmailIcon className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-xs text-muted-foreground">Email</p>
											<a
												href={`mailto:${lead.email}`}
												className="font-medium hover:text-[var(--casalia-orange)]"
											>
												{lead.email}
											</a>
										</div>
									</div>
								)}

								{lead.phone && (
									<div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-lg">
										<PhoneIcon className="h-5 w-5 text-muted-foreground" />
										<div>
											<p className="text-xs text-muted-foreground">Telefono</p>
											<a
												href={`tel:${lead.phone}`}
												className="font-medium hover:text-[var(--casalia-orange)]"
											>
												{lead.phone}
											</a>
										</div>
									</div>
								)}
							</div>

							{lead.message && (
								<div className="mt-6 pt-6 border-t border-border">
									<h3 className="font-medium mb-2">Mensaje</h3>
									<p className="text-muted-foreground whitespace-pre-wrap">
										{lead.message}
									</p>
								</div>
							)}

							{lead.notes && (
								<div className="mt-6 pt-6 border-t border-border">
									<h3 className="font-medium mb-2">Notas internas</h3>
									<p className="text-muted-foreground whitespace-pre-wrap">
										{lead.notes}
									</p>
								</div>
							)}
						</Card>

						{/* Property info */}
						{lead.property && (
							<Card className="p-6">
								<h3 className="font-semibold mb-4 flex items-center gap-2">
									<PropertyIcon className="h-5 w-5" />
									Propiedad de interes
								</h3>
								<div className="flex items-center justify-between p-4 bg-zinc-50 rounded-lg">
									<div>
										<p className="font-medium">{lead.property.title}</p>
										<p className="text-sm text-muted-foreground">
											{formatPrice(lead.property.price)}
											{lead.property.operationType === "alquiler" && "/mes"}
										</p>
									</div>
									<Link
										href={`/${lead.property.operationType === "venta" ? "comprar" : "alquilar"}/${lead.property.slug}`}
										target="_blank"
									>
										<Button variant="outline" size="sm">
											Ver propiedad
										</Button>
									</Link>
								</div>
							</Card>
						)}
					</div>

					{/* Actions sidebar */}
					<div className="space-y-6">
						{/* Quick actions */}
						<Card className="p-6">
							<h3 className="font-semibold mb-4">Acciones rapidas</h3>
							<div className="space-y-3">
								{whatsappUrl && (
									<a
										href={whatsappUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
									>
										<WhatsappIcon className="h-5 w-5" weight="fill" />
										WhatsApp
									</a>
								)}

								{lead.phone && (
									<a
										href={`tel:${lead.phone}`}
										className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)] text-white rounded-lg font-medium transition-colors"
									>
										<PhoneIcon className="h-5 w-5" />
										Llamar
									</a>
								)}

								{lead.email && (
									<a
										href={`mailto:${lead.email}`}
										className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-border hover:bg-zinc-50 rounded-lg font-medium transition-colors"
									>
										<EmailIcon className="h-5 w-5" />
										Email
									</a>
								)}
							</div>
						</Card>

						{/* Change status */}
						<Card className="p-6">
							<h3 className="font-semibold mb-4">Cambiar estado</h3>
							<form action={updateLeadStatus} className="space-y-3">
								<input type="hidden" name="leadId" value={lead.id} />
								{["nuevo", "contactado", "visita", "cerrado", "descartado"].map(
									(status) => (
										<button
											key={status}
											type="submit"
											name="status"
											value={status}
											disabled={lead.status === status}
											className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
												lead.status === status
													? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
													: "hover:bg-zinc-50"
											}`}
										>
											{status}
										</button>
									),
								)}
							</form>
						</Card>

						{/* Info */}
						<Card className="p-6">
							<h3 className="font-semibold mb-4">Informacion</h3>
							<dl className="space-y-3 text-sm">
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Fuente</dt>
									<dd className="font-medium capitalize">{lead.source}</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Creado</dt>
									<dd className="font-medium">{formatDate(lead.createdAt)}</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-muted-foreground">Actualizado</dt>
									<dd className="font-medium">{formatDate(lead.updatedAt)}</dd>
								</div>
							</dl>
						</Card>
					</div>
				</div>
			</main>
		</>
	);
}

function StatusBadge({ status }: { status: string }) {
	const variants: Record<string, string> = {
		nuevo: "bg-green-100 text-green-700",
		contactado: "bg-blue-100 text-blue-700",
		visita: "bg-purple-100 text-purple-700",
		cerrado: "bg-zinc-100 text-zinc-700",
		descartado: "bg-red-100 text-red-700",
	};

	return (
		<span
			className={`inline-block px-3 py-1 text-sm font-medium rounded-full capitalize ${variants[status] || "bg-zinc-100 text-zinc-700"}`}
		>
			{status}
		</span>
	);
}

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat("es-ES", {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(date);
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
