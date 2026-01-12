"use client";

import { SpinnerGap as SpinnerIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";

import {
	createProperty,
	updateProperty,
} from "@/app/admin/propiedades/actions";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Property } from "@/lib/db/schema";

interface PropertyImage {
	id?: string;
	url: string;
	order: number;
	isPrimary: boolean;
}

interface PropertyFormProps {
	userId: string;
	property?: Property;
	initialImages?: PropertyImage[];
}

interface FormState {
	error?: string;
	success?: boolean;
}

const PROPERTY_TYPES = [
	{ value: "piso", label: "Piso" },
	{ value: "casa", label: "Casa" },
	{ value: "terreno", label: "Terreno" },
	{ value: "local", label: "Local" },
	{ value: "garaje", label: "Garaje" },
	{ value: "trastero", label: "Trastero" },
];

const OPERATION_TYPES = [
	{ value: "venta", label: "Venta" },
	{ value: "alquiler", label: "Alquiler" },
];

const STATUS_OPTIONS = [
	{ value: "disponible", label: "Disponible" },
	{ value: "reservado", label: "Reservado" },
	{ value: "vendido", label: "Vendido" },
	{ value: "alquilado", label: "Alquilado" },
];

const ENERGY_CERTIFICATES = [
	{ value: "A", label: "A" },
	{ value: "B", label: "B" },
	{ value: "C", label: "C" },
	{ value: "D", label: "D" },
	{ value: "E", label: "E" },
	{ value: "F", label: "F" },
	{ value: "G", label: "G" },
	{ value: "en_tramite", label: "En tramite" },
	{ value: "exento", label: "Exento" },
];

export function PropertyForm({
	userId,
	property,
	initialImages = [],
}: PropertyFormProps) {
	const router = useRouter();
	const isEditing = !!property;
	const [images, setImages] = useState<PropertyImage[]>(initialImages);

	// Generate a temporary ID for new properties to allow image uploads
	const [tempPropertyId] = useState(
		() =>
			property?.id ??
			`temp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
	);

	const formAction = async (
		_prevState: FormState,
		formData: FormData,
	): Promise<FormState> => {
		formData.set("userId", userId);

		if (isEditing && property) {
			formData.set("propertyId", property.id);
			const result = await updateProperty(formData);
			if (result?.error) {
				return { error: result.error };
			}
		} else {
			const result = await createProperty(formData);
			if (result?.error) {
				return { error: result.error };
			}
		}

		router.push("/admin/propiedades");
		router.refresh();
		return { success: true };
	};

	const [state, action, isPending] = useActionState(formAction, {});

	return (
		<form action={action} className="space-y-6 max-w-4xl">
			{state.error && (
				<div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
					{state.error}
				</div>
			)}

			{/* Basic Info */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Informacion basica</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="md:col-span-2 space-y-2">
						<Label htmlFor="title">Titulo *</Label>
						<Input
							id="title"
							name="title"
							defaultValue={property?.title}
							required
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="propertyType">Tipo de propiedad *</Label>
						<select
							id="propertyType"
							name="propertyType"
							defaultValue={property?.propertyType}
							required
							disabled={isPending}
							className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
						>
							{PROPERTY_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="operationType">Operacion *</Label>
						<select
							id="operationType"
							name="operationType"
							defaultValue={property?.operationType}
							required
							disabled={isPending}
							className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
						>
							{OPERATION_TYPES.map((type) => (
								<option key={type.value} value={type.value}>
									{type.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="status">Estado</Label>
						<select
							id="status"
							name="status"
							defaultValue={property?.status || "disponible"}
							disabled={isPending}
							className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
						>
							{STATUS_OPTIONS.map((status) => (
								<option key={status.value} value={status.value}>
									{status.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="price">Precio (EUR) *</Label>
						<Input
							id="price"
							name="price"
							type="number"
							step="0.01"
							defaultValue={property?.price}
							required
							disabled={isPending}
						/>
					</div>

					<div className="md:col-span-2 space-y-2">
						<Label htmlFor="description">Descripcion *</Label>
						<textarea
							id="description"
							name="description"
							rows={5}
							defaultValue={property?.description}
							required
							disabled={isPending}
							className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
						/>
					</div>
				</div>
			</Card>

			{/* Characteristics */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Caracteristicas</h2>
				<div className="grid gap-4 md:grid-cols-4">
					<div className="space-y-2">
						<Label htmlFor="bedrooms">Habitaciones</Label>
						<Input
							id="bedrooms"
							name="bedrooms"
							type="number"
							min="0"
							defaultValue={property?.bedrooms ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="bathrooms">Banos</Label>
						<Input
							id="bathrooms"
							name="bathrooms"
							type="number"
							min="0"
							defaultValue={property?.bathrooms ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sqmBuilt">m2 construidos</Label>
						<Input
							id="sqmBuilt"
							name="sqmBuilt"
							type="number"
							min="0"
							defaultValue={property?.sqmBuilt ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="sqmUseful">m2 utiles</Label>
						<Input
							id="sqmUseful"
							name="sqmUseful"
							type="number"
							min="0"
							defaultValue={property?.sqmUseful ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="floor">Planta</Label>
						<Input
							id="floor"
							name="floor"
							defaultValue={property?.floor ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="yearBuilt">Ano construccion</Label>
						<Input
							id="yearBuilt"
							name="yearBuilt"
							type="number"
							min="1800"
							max={new Date().getFullYear()}
							defaultValue={property?.yearBuilt ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="energyCertificate">Certificado energetico</Label>
						<select
							id="energyCertificate"
							name="energyCertificate"
							defaultValue={property?.energyCertificate ?? ""}
							disabled={isPending}
							className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
						>
							<option value="">Sin especificar</option>
							{ENERGY_CERTIFICATES.map((cert) => (
								<option key={cert.value} value={cert.value}>
									{cert.label}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="communityFee">Comunidad (EUR/mes)</Label>
						<Input
							id="communityFee"
							name="communityFee"
							type="number"
							step="0.01"
							min="0"
							defaultValue={property?.communityFee ?? ""}
							disabled={isPending}
						/>
					</div>
				</div>

				{/* Features checkboxes */}
				<div className="mt-6 pt-6 border-t border-border">
					<Label className="mb-4 block">Extras</Label>
					<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
						{[
							{ name: "hasElevator", label: "Ascensor" },
							{ name: "hasParking", label: "Garaje" },
							{ name: "hasTerrace", label: "Terraza" },
							{ name: "hasPool", label: "Piscina" },
							{ name: "hasAirConditioning", label: "Aire acondicionado" },
						].map((feature) => (
							<label
								key={feature.name}
								className="flex items-center gap-2 cursor-pointer"
							>
								<input
									type="checkbox"
									name={feature.name}
									defaultChecked={
										property?.[feature.name as keyof Property] === true
									}
									disabled={isPending}
									className="h-4 w-4 rounded border-input"
								/>
								<span className="text-sm">{feature.label}</span>
							</label>
						))}
					</div>
				</div>
			</Card>

			{/* Location */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Ubicacion</h2>
				<div className="grid gap-4 md:grid-cols-2">
					<div className="space-y-2">
						<Label htmlFor="zone">Zona</Label>
						<Input
							id="zone"
							name="zone"
							defaultValue={property?.zone ?? ""}
							disabled={isPending}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="address">Direccion</Label>
						<Input
							id="address"
							name="address"
							defaultValue={property?.address ?? ""}
							disabled={isPending}
						/>
					</div>
				</div>
			</Card>

			{/* Images */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Imagenes</h2>
				<ImageUploader
					propertyId={tempPropertyId}
					images={images}
					onImagesChange={setImages}
					disabled={isPending}
				/>
			</Card>

			{/* Options */}
			<Card className="p-6">
				<h2 className="text-lg font-semibold mb-4">Opciones</h2>
				<div className="space-y-4">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							name="isHighlighted"
							defaultChecked={property?.isHighlighted === true}
							disabled={isPending}
							className="h-4 w-4 rounded border-input"
						/>
						<span className="text-sm">Destacar propiedad</span>
					</label>

					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							name="syncIdealista"
							defaultChecked={property?.syncIdealista === true}
							disabled={isPending}
							className="h-4 w-4 rounded border-input"
						/>
						<span className="text-sm">Sincronizar con Idealista</span>
					</label>

					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							name="syncFotocasa"
							defaultChecked={property?.syncFotocasa === true}
							disabled={isPending}
							className="h-4 w-4 rounded border-input"
						/>
						<span className="text-sm">Sincronizar con Fotocasa</span>
					</label>
				</div>
			</Card>

			{/* Submit */}
			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={isPending}
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					className="bg-[var(--casalia-orange)] hover:bg-[var(--casalia-orange-dark)]"
					disabled={isPending}
				>
					{isPending ? (
						<>
							<SpinnerIcon className="h-4 w-4 mr-2 animate-spin" />
							Guardando...
						</>
					) : isEditing ? (
						"Guardar cambios"
					) : (
						"Crear propiedad"
					)}
				</Button>
			</div>
		</form>
	);
}
