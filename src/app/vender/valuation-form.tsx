"use client";

import {
	HouseLine as HouseIcon,
	PaperPlaneTilt as SendIcon,
	SpinnerGap as SpinnerIcon,
	CheckCircle as CheckIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { submitValuationRequest, type ValuationFormData } from "./actions";

const PROPERTY_TYPES = [
	{ value: "piso", label: "Piso" },
	{ value: "casa", label: "Casa / Chalet" },
	{ value: "atico", label: "Atico" },
	{ value: "duplex", label: "Duplex" },
	{ value: "chalet", label: "Chalet independiente" },
	{ value: "local", label: "Local comercial" },
	{ value: "garaje", label: "Garaje" },
	{ value: "trastero", label: "Trastero" },
	{ value: "otro", label: "Otro" },
] as const;

const CONDITION_OPTIONS = [
	{ value: "nueva", label: "Obra nueva / A estrenar" },
	{ value: "buen_estado", label: "Buen estado" },
	{ value: "reformar", label: "Necesita reformas menores" },
	{ value: "para_reformar", label: "Para reformar" },
] as const;

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ValuationForm() {
	const [status, setStatus] = useState<FormStatus>("idle");
	const [errorMessage, setErrorMessage] = useState<string>("");

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setStatus("submitting");
		setErrorMessage("");

		const formElement = event.currentTarget;
		const formData = new FormData(formElement);

		const data: ValuationFormData = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			phone: formData.get("phone") as string,
			propertyType: formData.get("propertyType") as ValuationFormData["propertyType"],
			address: formData.get("address") as string,
			area: Number(formData.get("area")),
			bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : undefined,
			bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : undefined,
			condition: formData.get("condition") as ValuationFormData["condition"] | undefined,
			additionalInfo: formData.get("additionalInfo") as string | undefined,
		};

		const result = await submitValuationRequest(data);

		if (result.success) {
			setStatus("success");
			formElement.reset();
		} else {
			setStatus("error");
			setErrorMessage(result.error ?? "Error al enviar la solicitud");
		}
	}

	if (status === "success") {
		return (
			<Card className="p-8 text-center">
				<div className="flex flex-col items-center gap-4">
					<div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
						<CheckIcon className="w-8 h-8 text-green-600" weight="fill" />
					</div>
					<h3 className="text-2xl font-semibold">¡Solicitud enviada!</h3>
					<p className="text-muted-foreground max-w-md">
						Hemos recibido tu solicitud de valoracion. Uno de nuestros agentes se
						pondra en contacto contigo en las proximas 24-48 horas.
					</p>
					<Button
						variant="outline"
						onClick={() => setStatus("idle")}
						className="mt-4"
					>
						Enviar otra solicitud
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-6 md:p-8">
			<div className="flex items-center gap-3 mb-6">
				<div className="w-10 h-10 rounded-full bg-[var(--casalia-orange)]/10 flex items-center justify-center">
					<HouseIcon className="w-5 h-5 text-[var(--casalia-orange)]" />
				</div>
				<div>
					<h2 className="text-xl font-semibold">Solicita tu valoracion gratuita</h2>
					<p className="text-sm text-muted-foreground">
						Sin compromiso, en 24-48 horas
					</p>
				</div>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Contact Info */}
				<div className="space-y-4">
					<h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
						Datos de contacto
					</h3>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="name">Nombre completo *</Label>
							<Input
								id="name"
								name="name"
								placeholder="Tu nombre"
								required
								disabled={status === "submitting"}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="phone">Telefono *</Label>
							<Input
								id="phone"
								name="phone"
								type="tel"
								placeholder="666 123 456"
								required
								disabled={status === "submitting"}
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email *</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder="tu@email.com"
							required
							disabled={status === "submitting"}
						/>
					</div>
				</div>

				{/* Property Info */}
				<div className="space-y-4">
					<h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
						Datos de la propiedad
					</h3>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="propertyType">Tipo de inmueble *</Label>
							<Select name="propertyType" required disabled={status === "submitting"}>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona tipo" />
								</SelectTrigger>
								<SelectContent>
									{PROPERTY_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label htmlFor="condition">Estado del inmueble</Label>
							<Select name="condition" disabled={status === "submitting"}>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona estado" />
								</SelectTrigger>
								<SelectContent>
									{CONDITION_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Direccion completa *</Label>
						<Input
							id="address"
							name="address"
							placeholder="Calle, numero, piso, puerta, ciudad"
							required
							disabled={status === "submitting"}
						/>
					</div>

					<div className="grid gap-4 md:grid-cols-3">
						<div className="space-y-2">
							<Label htmlFor="area">Metros cuadrados *</Label>
							<Input
								id="area"
								name="area"
								type="number"
								min="1"
								placeholder="80"
								required
								disabled={status === "submitting"}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bedrooms">Habitaciones</Label>
							<Input
								id="bedrooms"
								name="bedrooms"
								type="number"
								min="0"
								placeholder="3"
								disabled={status === "submitting"}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bathrooms">Banos</Label>
							<Input
								id="bathrooms"
								name="bathrooms"
								type="number"
								min="0"
								placeholder="2"
								disabled={status === "submitting"}
							/>
						</div>
					</div>
				</div>

				{/* Additional Info */}
				<div className="space-y-2">
					<Label htmlFor="additionalInfo">Informacion adicional</Label>
					<Textarea
						id="additionalInfo"
						name="additionalInfo"
						placeholder="Cuentanos mas sobre tu propiedad: reformas realizadas, orientacion, vistas, extras..."
						rows={4}
						disabled={status === "submitting"}
					/>
				</div>

				{/* Error Message */}
				{status === "error" && errorMessage && (
					<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
						{errorMessage}
					</div>
				)}

				{/* Submit Button */}
				<Button
					type="submit"
					size="lg"
					className="w-full gap-2 bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]"
					disabled={status === "submitting"}
				>
					{status === "submitting" ? (
						<>
							<SpinnerIcon className="w-5 h-5 animate-spin" />
							Enviando...
						</>
					) : (
						<>
							<SendIcon className="w-5 h-5" />
							Solicitar valoracion gratuita
						</>
					)}
				</Button>

				{/* Privacy Notice */}
				<p className="text-xs text-muted-foreground text-center">
					Al enviar este formulario, aceptas nuestra{" "}
					<a href="/privacidad" className="underline hover:text-foreground">
						Politica de Privacidad
					</a>
					. Tus datos seran tratados de forma confidencial.
				</p>
			</form>
		</Card>
	);
}
