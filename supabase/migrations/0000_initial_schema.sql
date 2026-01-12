CREATE TYPE "public"."appointment_status" AS ENUM('programada', 'completada', 'cancelada');--> statement-breakpoint
CREATE TYPE "public"."energy_certificate" AS ENUM('A', 'B', 'C', 'D', 'E', 'F', 'G', 'en_tramite', 'exento');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('web', 'idealista', 'fotocasa', 'whatsapp', 'telefono', 'presencial');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('nuevo', 'contactado', 'visita', 'cerrado', 'descartado');--> statement-breakpoint
CREATE TYPE "public"."operation_type" AS ENUM('venta', 'alquiler');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('borrador', 'publicado');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('disponible', 'reservado', 'vendido', 'alquilado');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('piso', 'casa', 'terreno', 'local', 'garaje', 'trastero');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'agent');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"lead_id" uuid,
	"agent_id" uuid,
	"scheduled_at" timestamp NOT NULL,
	"status" "appointment_status" DEFAULT 'programada' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"message" text,
	"source" "lead_source" DEFAULT 'web' NOT NULL,
	"status" "lead_status" DEFAULT 'nuevo' NOT NULL,
	"notes" text,
	"assigned_to" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"featured_image" text,
	"category" varchar(100),
	"status" "post_status" DEFAULT 'borrador' NOT NULL,
	"author_id" uuid,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(12, 2) NOT NULL,
	"price_per_sqm" numeric(10, 2),
	"sqm_built" integer,
	"sqm_useful" integer,
	"bedrooms" integer,
	"bathrooms" integer,
	"zone" varchar(255),
	"address" text,
	"lat" numeric(10, 8),
	"lng" numeric(11, 8),
	"year_built" integer,
	"energy_certificate" "energy_certificate",
	"property_type" "property_type" NOT NULL,
	"operation_type" "operation_type" NOT NULL,
	"status" "property_status" DEFAULT 'disponible' NOT NULL,
	"features" jsonb,
	"community_fee" numeric(8, 2),
	"floor" varchar(50),
	"has_elevator" boolean DEFAULT false,
	"has_parking" boolean DEFAULT false,
	"has_terrace" boolean DEFAULT false,
	"has_pool" boolean DEFAULT false,
	"has_air_conditioning" boolean DEFAULT false,
	"tour_360_url" text,
	"is_highlighted" boolean DEFAULT false,
	"sync_idealista" boolean DEFAULT false,
	"sync_fotocasa" boolean DEFAULT false,
	"idealista_id" varchar(100),
	"fotocasa_id" varchar(100),
	"created_by" uuid,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "properties_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"url" text NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"portal" varchar(50) NOT NULL,
	"action" varchar(50) NOT NULL,
	"success" boolean NOT NULL,
	"response" jsonb,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'agent' NOT NULL,
	"avatar_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_agent_id_users_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_images" ADD CONSTRAINT "property_images_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_logs" ADD CONSTRAINT "sync_logs_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;