"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin as MapPinIcon } from "@phosphor-icons/react";
import { useCallback, useState } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyMapProps {
	lat: number;
	lng: number;
	title?: string;
	address?: string;
	className?: string;
}

const mapContainerStyle = {
	width: "100%",
	height: "100%",
};

const defaultOptions: google.maps.MapOptions = {
	disableDefaultUI: false,
	zoomControl: true,
	streetViewControl: true,
	mapTypeControl: false,
	fullscreenControl: true,
	styles: [
		{
			featureType: "poi",
			elementType: "labels",
			stylers: [{ visibility: "off" }],
		},
	],
};

export function PropertyMap({
	lat,
	lng,
	title,
	address,
	className,
}: PropertyMapProps) {
	const [map, setMap] = useState<google.maps.Map | null>(null);

	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

	const { isLoaded, loadError } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: apiKey ?? "",
	});

	const center = { lat, lng };

	const onLoad = useCallback((mapInstance: google.maps.Map) => {
		setMap(mapInstance);
	}, []);

	const onUnmount = useCallback(() => {
		setMap(null);
	}, []);

	// No API key configured
	if (!apiKey) {
		return (
			<Card className={`flex flex-col items-center justify-center p-8 bg-muted/50 ${className ?? ""}`}>
				<MapPinIcon className="w-12 h-12 text-muted-foreground mb-4" />
				<p className="text-sm text-muted-foreground text-center">
					{address ?? "Ubicacion de la propiedad"}
				</p>
				<p className="text-xs text-muted-foreground/60 mt-2">
					Mapa no disponible
				</p>
			</Card>
		);
	}

	// Loading error
	if (loadError) {
		return (
			<Card className={`flex flex-col items-center justify-center p-8 bg-muted/50 ${className ?? ""}`}>
				<MapPinIcon className="w-12 h-12 text-muted-foreground mb-4" />
				<p className="text-sm text-muted-foreground text-center">
					Error al cargar el mapa
				</p>
			</Card>
		);
	}

	// Loading state
	if (!isLoaded) {
		return (
			<Skeleton className={`w-full ${className ?? "h-[300px]"}`} />
		);
	}

	return (
		<div className={`relative rounded-lg overflow-hidden ${className ?? "h-[300px]"}`}>
			<GoogleMap
				mapContainerStyle={mapContainerStyle}
				center={center}
				zoom={15}
				options={defaultOptions}
				onLoad={onLoad}
				onUnmount={onUnmount}
			>
				<Marker
					position={center}
					title={title}
				/>
			</GoogleMap>

			{/* Address overlay */}
			{address && (
				<div className="absolute bottom-4 left-4 right-4">
					<div className="bg-background/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
						<div className="flex items-center gap-2">
							<MapPinIcon className="w-4 h-4 text-[var(--casalia-orange)]" />
							<p className="text-sm font-medium truncate">{address}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
