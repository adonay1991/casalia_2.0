/**
 * Database Seed Script
 *
 * Populates the database with sample data for development.
 * Run with: bun run db:seed
 */

import { db } from "../src/lib/db";
import {
	leads,
	posts,
	properties,
	propertyImages,
	users,
} from "../src/lib/db/schema";

// Helper to generate slug from title
function slugify(text: string): string {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Remove accents
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

async function seed() {
	console.log("🌱 Starting database seed...\n");

	// Clean existing data (in reverse order of dependencies)
	console.log("🧹 Cleaning existing data...");
	await db.delete(propertyImages);
	await db.delete(leads);
	await db.delete(posts);
	await db.delete(properties);
	await db.delete(users);

	// 1. Create Users
	console.log("👤 Creating users...");
	const [adminUser, agentUser] = await db
		.insert(users)
		.values([
			{
				email: "admin@casalia.org",
				name: "Administrador Casalia",
				role: "admin",
			},
			{
				email: "agente@casalia.org",
				name: "Maria Garcia",
				role: "agent",
			},
		])
		.returning();

	console.log(`   Created ${adminUser?.name} (admin)`);
	console.log(`   Created ${agentUser?.name} (agent)`);

	// 2. Create Properties
	console.log("\n🏠 Creating properties...");

	const propertyData = [
		// VENTAS
		{
			title: "Piso reformado en Parla Centro",
			description: `Magnifico piso totalmente reformado en el corazon de Parla.

Dispone de 3 amplias habitaciones, salon comedor luminoso, cocina equipada con electrodomesticos de alta gama, y 2 banos completos (uno en suite).

Caracteristicas destacadas:
- Suelos de parquet en toda la vivienda
- Ventanas de doble acristalamiento con rotura de puente termico
- Aire acondicionado por conductos
- Calefaccion central
- Plaza de garaje incluida en el precio

Ubicacion inmejorable: a 5 minutos andando de la estacion de Cercanias de Parla, supermercados, colegios y todos los servicios.`,
			price: "269900",
			pricePerSqm: "2871",
			sqmBuilt: 94,
			sqmUseful: 86,
			bedrooms: 3,
			bathrooms: 2,
			zone: "Parla Centro",
			address: "Calle Real, 45",
			lat: "40.2381",
			lng: "-3.7676",
			yearBuilt: 2005,
			energyCertificate: "C" as const,
			propertyType: "piso" as const,
			operationType: "venta" as const,
			status: "disponible" as const,
			features: {
				heatingType: "Central",
				orientation: "Sur",
				builtInWardrobes: true,
				storageRoom: true,
				furnished: false,
			},
			communityFee: "65",
			floor: "3",
			hasElevator: true,
			hasParking: true,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: true,
			isHighlighted: true,
			syncIdealista: true,
			syncFotocasa: true,
		},
		{
			title: "Atico duplex con terraza en El Nido",
			description: `Espectacular atico duplex con impresionantes vistas en la zona de El Nido.

Planta inferior: amplio salon con salida a terraza de 25m2, cocina independiente totalmente equipada, 2 habitaciones y 1 bano completo.

Planta superior: suite principal con vestidor y bano privado, terraza solárium de 40m2.

Extras incluidos:
- 2 plazas de garaje
- Trastero de 8m2
- Piscina comunitaria
- Zonas ajardinadas

Comunidad con vigilancia 24 horas. Ideal para familias que buscan espacio y tranquilidad.`,
			price: "389000",
			pricePerSqm: "2961",
			sqmBuilt: 132,
			sqmUseful: 118,
			bedrooms: 3,
			bathrooms: 2,
			zone: "El Nido",
			address: "Avenida de Madrid, 120",
			lat: "40.2456",
			lng: "-3.7589",
			yearBuilt: 2010,
			energyCertificate: "B" as const,
			propertyType: "piso" as const,
			operationType: "venta" as const,
			status: "disponible" as const,
			features: {
				heatingType: "Individual gas",
				orientation: "Este-Oeste",
				builtInWardrobes: true,
				storageRoom: true,
				furnished: false,
			},
			communityFee: "120",
			floor: "5",
			hasElevator: true,
			hasParking: true,
			hasTerrace: true,
			hasPool: true,
			hasAirConditioning: true,
			isHighlighted: true,
			syncIdealista: true,
			syncFotocasa: true,
		},
		{
			title: "Piso economico en Parla Este",
			description: `Oportunidad unica: piso a buen precio en Parla Este, perfecto para inversores o primera vivienda.

Distribucion funcional con 2 habitaciones, salon independiente, cocina con tendedero, y bano con plato de ducha.

Necesita actualizacion de acabados, pero tiene un gran potencial. Estructura en perfecto estado.

Zona muy bien comunicada con autobus y cercano al centro comercial.`,
			price: "124900",
			pricePerSqm: "1961",
			sqmBuilt: 64,
			sqmUseful: 58,
			bedrooms: 2,
			bathrooms: 1,
			zone: "Parla Este",
			address: "Calle Guadalajara, 22",
			lat: "40.2345",
			lng: "-3.7545",
			yearBuilt: 1985,
			energyCertificate: "E" as const,
			propertyType: "piso" as const,
			operationType: "venta" as const,
			status: "disponible" as const,
			features: {
				heatingType: "Individual electrico",
				orientation: "Norte",
				builtInWardrobes: false,
				storageRoom: false,
				furnished: false,
			},
			communityFee: "35",
			floor: "2",
			hasElevator: false,
			hasParking: false,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: false,
			isHighlighted: false,
			syncIdealista: true,
			syncFotocasa: false,
		},
		{
			title: "Chalet adosado con jardin en Parla Norte",
			description: `Fantastico chalet adosado de 4 habitaciones en urbanizacion privada.

Planta baja: salon de 35m2 con chimenea, cocina amplia con acceso a jardin privado de 50m2, aseo de cortesia.

Primera planta: 4 dormitorios (principal con bano en suite y terraza), bano completo.

Sotano: garaje para 2 vehiculos, lavadero y bodega.

Urbanizacion con piscina comunitaria, pistas de padel y zonas infantiles. Seguridad 24h.`,
			price: "459000",
			pricePerSqm: "2550",
			sqmBuilt: 180,
			sqmUseful: 165,
			bedrooms: 4,
			bathrooms: 3,
			zone: "Parla Norte",
			address: "Urbanizacion Los Jardines, 15",
			lat: "40.2512",
			lng: "-3.7701",
			yearBuilt: 2008,
			energyCertificate: "B" as const,
			propertyType: "casa" as const,
			operationType: "venta" as const,
			status: "reservado" as const,
			features: {
				heatingType: "Individual gas",
				orientation: "Sur",
				builtInWardrobes: true,
				storageRoom: true,
				furnished: false,
			},
			communityFee: "85",
			floor: null,
			hasElevator: false,
			hasParking: true,
			hasTerrace: true,
			hasPool: true,
			hasAirConditioning: true,
			isHighlighted: true,
			syncIdealista: true,
			syncFotocasa: true,
		},
		{
			title: "Local comercial en zona centrica",
			description: `Local comercial en pleno centro de Parla, zona de alto transito peatonal.

Superficie diafana de 85m2, ideal para cualquier tipo de negocio. Escaparate de 6 metros lineales con gran visibilidad.

Dispone de aseo adaptado y salida de humos (apto para hosteleria).

Actualmente alquilado con rentabilidad del 6.2% anual. Se vende con inquilino.`,
			price: "195000",
			pricePerSqm: "2294",
			sqmBuilt: 85,
			sqmUseful: 80,
			bedrooms: null,
			bathrooms: 1,
			zone: "Parla Centro",
			address: "Calle Mayor, 28",
			lat: "40.2378",
			lng: "-3.7668",
			yearBuilt: 1995,
			energyCertificate: "G" as const,
			propertyType: "local" as const,
			operationType: "venta" as const,
			status: "disponible" as const,
			features: {},
			communityFee: "45",
			floor: "Bajo",
			hasElevator: false,
			hasParking: false,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: true,
			isHighlighted: false,
			syncIdealista: true,
			syncFotocasa: false,
		},

		// ALQUILERES
		{
			title: "Piso amueblado en alquiler - Parla Centro",
			description: `Piso completamente amueblado y equipado, listo para entrar a vivir.

3 habitaciones (2 dobles + 1 individual), salon con sofa cama, cocina equipada con lavavajillas, 1 bano completo.

Incluye:
- Electrodomesticos
- Menaje de cocina
- Ropa de cama
- Internet fibra optica

Gastos de comunidad y agua incluidos en el precio. Solo luz aparte.

Se requiere: nomina, fianza (2 meses), mes en curso.`,
			price: "850",
			pricePerSqm: null,
			sqmBuilt: 75,
			sqmUseful: 68,
			bedrooms: 3,
			bathrooms: 1,
			zone: "Parla Centro",
			address: "Calle Segovia, 12",
			lat: "40.2365",
			lng: "-3.7645",
			yearBuilt: 2000,
			energyCertificate: "D" as const,
			propertyType: "piso" as const,
			operationType: "alquiler" as const,
			status: "disponible" as const,
			features: {
				heatingType: "Central",
				orientation: "Este",
				builtInWardrobes: true,
				storageRoom: false,
				furnished: true,
			},
			communityFee: null,
			floor: "4",
			hasElevator: true,
			hasParking: false,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: true,
			isHighlighted: true,
			syncIdealista: true,
			syncFotocasa: true,
		},
		{
			title: "Estudio en alquiler cerca del metro",
			description: `Acogedor estudio ideal para una persona o pareja.

Espacio diafano de 35m2 con zona de dormitorio separada visualmente, cocina americana equipada y bano con ducha.

A solo 3 minutos andando de la estacion de metro de Parla.

Edificio con ascensor y portero fisico.`,
			price: "550",
			pricePerSqm: null,
			sqmBuilt: 35,
			sqmUseful: 32,
			bedrooms: 1,
			bathrooms: 1,
			zone: "Parla Centro",
			address: "Calle Toledo, 8",
			lat: "40.2372",
			lng: "-3.7658",
			yearBuilt: 2015,
			energyCertificate: "C" as const,
			propertyType: "piso" as const,
			operationType: "alquiler" as const,
			status: "disponible" as const,
			features: {
				heatingType: "Individual electrico",
				orientation: "Sur",
				builtInWardrobes: true,
				storageRoom: false,
				furnished: true,
			},
			communityFee: null,
			floor: "6",
			hasElevator: true,
			hasParking: false,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: true,
			isHighlighted: false,
			syncIdealista: true,
			syncFotocasa: true,
		},
		{
			title: "Chalet independiente en alquiler",
			description: `Impresionante chalet independiente en parcela de 400m2.

Vivienda de 220m2 distribuidos en 2 plantas:
- Planta baja: salon de 50m2, cocina con office, dormitorio de servicio con bano, porche cubierto
- Planta alta: 4 dormitorios, 2 banos completos, terraza

Jardin con cesped, piscina privada, barbacoa y garaje para 3 coches.

Amueblado con muebles de alta calidad. Disponible para larga temporada.`,
			price: "2200",
			pricePerSqm: null,
			sqmBuilt: 220,
			sqmUseful: 200,
			bedrooms: 5,
			bathrooms: 3,
			zone: "Parla Norte",
			address: "Camino de la Ermita, 5",
			lat: "40.2534",
			lng: "-3.7723",
			yearBuilt: 2012,
			energyCertificate: "A" as const,
			propertyType: "casa" as const,
			operationType: "alquiler" as const,
			status: "disponible" as const,
			features: {
				heatingType: "Suelo radiante",
				orientation: "Sur",
				builtInWardrobes: true,
				storageRoom: true,
				furnished: true,
				petsAllowed: true,
			},
			communityFee: null,
			floor: null,
			hasElevator: false,
			hasParking: true,
			hasTerrace: true,
			hasPool: true,
			hasAirConditioning: true,
			isHighlighted: true,
			syncIdealista: true,
			syncFotocasa: true,
		},
		{
			title: "Plaza de garaje en venta",
			description: `Plaza de garaje amplia en sotano -1, facil acceso y maniobra.

Medidas: 5m x 2.5m (apto para vehiculos grandes y SUV).

Puerta automatica con mando a distancia. Bien iluminado y ventilado.

Posibilidad de instalar punto de recarga para coche electrico.`,
			price: "18500",
			pricePerSqm: null,
			sqmBuilt: 12,
			sqmUseful: 12,
			bedrooms: null,
			bathrooms: null,
			zone: "Parla Centro",
			address: "Calle Real, 45 - Sotano",
			lat: "40.2381",
			lng: "-3.7676",
			yearBuilt: 2005,
			energyCertificate: "exento" as const,
			propertyType: "garaje" as const,
			operationType: "venta" as const,
			status: "disponible" as const,
			features: {},
			communityFee: "15",
			floor: "-1",
			hasElevator: false,
			hasParking: true,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: false,
			isHighlighted: false,
			syncIdealista: true,
			syncFotocasa: false,
		},
		{
			title: "Trastero en alquiler",
			description: `Trastero de 8m2 en edificio residencial con acceso 24 horas.

Ideal para guardar muebles, bicicletas, articulos de temporada, etc.

Zona seca y ventilada. Puerta metalica con cerradura de seguridad.`,
			price: "45",
			pricePerSqm: null,
			sqmBuilt: 8,
			sqmUseful: 8,
			bedrooms: null,
			bathrooms: null,
			zone: "Parla Este",
			address: "Calle Albacete, 30",
			lat: "40.2356",
			lng: "-3.7534",
			yearBuilt: 2000,
			energyCertificate: "exento" as const,
			propertyType: "trastero" as const,
			operationType: "alquiler" as const,
			status: "disponible" as const,
			features: {},
			communityFee: null,
			floor: "-1",
			hasElevator: false,
			hasParking: false,
			hasTerrace: false,
			hasPool: false,
			hasAirConditioning: false,
			isHighlighted: false,
			syncIdealista: false,
			syncFotocasa: false,
		},
	];

	const createdProperties = [];
	for (const prop of propertyData) {
		const slug = slugify(prop.title);
		const [created] = await db
			.insert(properties)
			.values({
				...prop,
				slug,
				createdBy: adminUser?.id,
				publishedAt: new Date(),
			})
			.returning();

		if (created) {
			createdProperties.push(created);
			console.log(`   ✓ ${created.title}`);
		}
	}

	// 3. Create Property Images (placeholder URLs)
	console.log("\n🖼️  Creating property images...");
	for (const prop of createdProperties) {
		const imageCount =
			prop.propertyType === "piso" || prop.propertyType === "casa" ? 5 : 2;

		const images = Array.from({ length: imageCount }, (_, i) => ({
			propertyId: prop.id,
			url: `https://placehold.co/800x600/e2e8f0/64748b.png?text=${encodeURIComponent(prop.title.substring(0, 20))}+${i + 1}`,
			order: i,
			isPrimary: i === 0,
		}));

		await db.insert(propertyImages).values(images);
	}
	console.log(`   Created images for ${createdProperties.length} properties`);

	// 4. Create Blog Posts
	console.log("\n📝 Creating blog posts...");
	const blogPosts = [
		{
			slug: "consejos-comprar-primera-vivienda",
			title: "10 Consejos para comprar tu primera vivienda",
			excerpt:
				"Guia completa para compradores primerizos: desde la busqueda hasta la firma ante notario.",
			content: `Comprar tu primera vivienda es una de las decisiones mas importantes de tu vida. Aqui te dejamos 10 consejos fundamentales:

## 1. Define tu presupuesto real

Antes de empezar a buscar, calcula cuanto puedes permitirte. La regla general es que la cuota de la hipoteca no supere el 30-35% de tus ingresos netos.

## 2. Ahorra para la entrada

Necesitaras al menos el 20% del valor de la vivienda para la entrada, mas un 10-12% adicional para gastos (impuestos, notaria, registro, gestoria).

## 3. Obtén preaprobacion hipotecaria

Antes de buscar activamente, consulta con varios bancos para saber cuanto te prestarian. Esto te dara una idea realista de tu presupuesto.

## 4. Prioriza ubicacion

La ubicacion es lo unico que no puedes cambiar de una vivienda. Considera: transporte, servicios, colegios, ambiente del barrio.

## 5. No te dejes llevar por las emociones

Visita varias viviendas antes de decidir. Es facil enamorarse de la primera, pero comparar te ayudara a tomar mejor decision.

## 6. Inspecciona a fondo

Revisa instalaciones, humedades, estado de ventanas, calderas, etc. Si es posible, lleva a un profesional.

## 7. Investiga la comunidad de propietarios

Solicita las ultimas actas de reuniones y el estado de cuentas. Evita sorpresas con derramas o problemas vecinales.

## 8. Negocia el precio

Casi siempre hay margen de negociacion. Un buen agente inmobiliario puede ayudarte a conseguir mejores condiciones.

## 9. Lee todo antes de firmar

Contrato de arras, escritura, condiciones de la hipoteca... Lee y entiende todo antes de firmar.

## 10. Cuenta con profesionales

Un buen asesor inmobiliario, un gestor y un abogado pueden ahorrarte muchos problemas y dinero a largo plazo.

---

En Casalia estamos para ayudarte en todo el proceso. Contactanos sin compromiso.`,
			category: "Consejos",
			status: "publicado" as const,
			authorId: adminUser?.id,
			publishedAt: new Date("2024-01-15"),
		},
		{
			slug: "mercado-inmobiliario-parla-2024",
			title: "El mercado inmobiliario en Parla: tendencias 2024",
			excerpt:
				"Analisis del mercado de vivienda en Parla: precios, demanda y proyecciones para este año.",
			content: `El mercado inmobiliario en Parla continua mostrando signos de fortaleza en 2024, consolidandose como una de las zonas mas atractivas del sur de Madrid.

## Precios actuales

El precio medio del metro cuadrado en Parla se situa en torno a los 1.800-2.200 euros, dependiendo de la zona:

- **Parla Centro**: 2.000-2.400 €/m2
- **El Nido**: 2.200-2.800 €/m2
- **Parla Este**: 1.600-2.000 €/m2
- **Parla Norte**: 2.000-2.500 €/m2

## Demanda creciente

La demanda de vivienda en Parla ha crecido un 15% respecto al año anterior, impulsada por:

- Mejora de comunicaciones (Metro y Cercanias)
- Precios mas asequibles que Madrid capital
- Nuevos desarrollos urbanisticos
- Servicios y comercios en expansion

## Alquiler en auge

El mercado de alquiler se mantiene muy activo, con una ocupacion cercana al 98% y precios que oscilan entre:

- Estudios: 450-550 €/mes
- 1-2 habitaciones: 600-750 €/mes
- 3+ habitaciones: 800-1.000 €/mes

## Proyecciones

Para el resto de 2024, esperamos:

- Incremento moderado de precios (3-5%)
- Mayor oferta de obra nueva
- Estabilidad en el mercado de alquiler

---

Si quieres conocer la valoracion de tu vivienda o buscas invertir en Parla, contacta con nuestro equipo.`,
			category: "Mercado",
			status: "publicado" as const,
			authorId: adminUser?.id,
			publishedAt: new Date("2024-02-20"),
		},
		{
			slug: "reformar-piso-antiguo-guia",
			title: "Guia completa para reformar un piso antiguo",
			excerpt:
				"Todo lo que necesitas saber antes de embarcarte en la reforma de una vivienda de segunda mano.",
			content: `Reformar un piso antiguo puede ser una excelente inversion, pero requiere planificacion. Te contamos los puntos clave.

## Antes de comprar: que revisar

1. **Instalacion electrica**: Los pisos anteriores a 1990 suelen necesitar actualizacion completa.
2. **Fontaneria**: Tuberias de plomo o hierro deben sustituirse.
3. **Humedades**: Revisa techos, paredes y suelos.
4. **Estructura**: Consulta con un arquitecto si hay grietas o deformaciones.

## Presupuesto orientativo

Para una reforma integral en Parla, los precios orientativos son:

| Tipo de reforma | Precio/m2 |
|----------------|-----------|
| Basica | 400-600 € |
| Media | 600-900 € |
| Alta calidad | 900-1.200 € |

## Permisos necesarios

- **Licencia de obra menor**: Para cambios sin afectar estructura (3-4 semanas)
- **Licencia de obra mayor**: Si tocas estructura, fachada o distribucion (2-3 meses)

## Consejos practicos

1. Pide al menos 3 presupuestos detallados
2. Firma contrato con plazos y penalizaciones
3. Reserva un 15-20% extra para imprevistos
4. Supervisa la obra regularmente

---

¿Buscas un piso para reformar? En Casalia tenemos varias opciones con gran potencial.`,
			category: "Reformas",
			status: "publicado" as const,
			authorId: agentUser?.id,
			publishedAt: new Date("2024-03-10"),
		},
	];

	for (const post of blogPosts) {
		await db.insert(posts).values(post);
		console.log(`   ✓ ${post.title}`);
	}

	// 5. Create Sample Leads
	console.log("\n📞 Creating sample leads...");
	const sampleLeads = [
		{
			name: "Juan Martinez",
			email: "juan.martinez@email.com",
			phone: "612345678",
			message:
				"Me interesa el piso de Parla Centro. Podemos concertar una visita?",
			source: "web" as const,
			status: "nuevo" as const,
			propertyId: createdProperties[0]?.id,
		},
		{
			name: "Ana Lopez",
			email: "ana.lopez@email.com",
			phone: "623456789",
			message:
				"Busco piso de 2-3 habitaciones en alquiler, presupuesto maximo 900 euros.",
			source: "idealista" as const,
			status: "contactado" as const,
			assignedTo: agentUser?.id,
		},
		{
			name: "Carlos Ruiz",
			email: "carlos.ruiz@email.com",
			phone: "634567890",
			message: "Interesado en el chalet de Parla Norte. Soy inversor.",
			source: "fotocasa" as const,
			status: "visita" as const,
			propertyId: createdProperties[3]?.id,
			assignedTo: agentUser?.id,
		},
	];

	for (const lead of sampleLeads) {
		await db.insert(leads).values(lead);
		console.log(`   ✓ ${lead.name} (${lead.status})`);
	}

	console.log("\n✅ Seed completed successfully!");
	console.log(`
Summary:
  - Users: 2
  - Properties: ${createdProperties.length}
  - Blog posts: ${blogPosts.length}
  - Leads: ${sampleLeads.length}
`);

	process.exit(0);
}

seed().catch((error) => {
	console.error("❌ Seed failed:", error);
	process.exit(1);
});
