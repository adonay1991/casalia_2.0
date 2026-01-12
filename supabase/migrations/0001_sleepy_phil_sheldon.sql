CREATE TYPE "public"."column_type" AS ENUM('text', 'number', 'date', 'checkbox', 'file', 'link', 'dropdown');--> statement-breakpoint
ALTER TYPE "public"."lead_source" ADD VALUE 'valoracion';--> statement-breakpoint
CREATE TABLE "custom_columns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"key" varchar(100) NOT NULL,
	"column_type" "column_type" NOT NULL,
	"is_required" boolean DEFAULT false,
	"order" integer DEFAULT 0 NOT NULL,
	"options" jsonb,
	"config" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_rows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"icon" varchar(50),
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "custom_tables_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "custom_columns" ADD CONSTRAINT "custom_columns_table_id_custom_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."custom_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_rows" ADD CONSTRAINT "custom_rows_table_id_custom_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."custom_tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_rows" ADD CONSTRAINT "custom_rows_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_tables" ADD CONSTRAINT "custom_tables_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;