import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";

// ===========================================
// Enums
// ===========================================

export const userRoleEnum = pgEnum("user_role", ["admin", "agent"]);

export const propertyTypeEnum = pgEnum("property_type", [
	"piso",
	"casa",
	"terreno",
	"local",
	"garaje",
	"trastero",
]);

export const operationTypeEnum = pgEnum("operation_type", [
	"venta",
	"alquiler",
]);

export const propertyStatusEnum = pgEnum("property_status", [
	"disponible",
	"reservado",
	"vendido",
	"alquilado",
]);

export const leadStatusEnum = pgEnum("lead_status", [
	"nuevo",
	"contactado",
	"visita",
	"cerrado",
	"descartado",
]);

export const leadSourceEnum = pgEnum("lead_source", [
	"web",
	"idealista",
	"fotocasa",
	"whatsapp",
	"telefono",
	"presencial",
	"valoracion",
]);

export const postStatusEnum = pgEnum("post_status", ["borrador", "publicado"]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
	"programada",
	"completada",
	"cancelada",
]);

export const energyCertificateEnum = pgEnum("energy_certificate", [
	"A",
	"B",
	"C",
	"D",
	"E",
	"F",
	"G",
	"en_tramite",
	"exento",
]);

// Custom tables column types
export const columnTypeEnum = pgEnum("column_type", [
	"text",
	"number",
	"date",
	"checkbox",
	"file",
	"link",
	"dropdown",
]);

// ===========================================
// Tables
// ===========================================

/**
 * Users table - stores admin and agent accounts
 * Linked to Supabase Auth via id
 */
export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	name: varchar("name", { length: 255 }).notNull(),
	role: userRoleEnum("role").notNull().default("agent"),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Properties table - main real estate listings
 */
export const properties = pgTable("properties", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	title: varchar("title", { length: 500 }).notNull(),
	description: text("description").notNull(),
	price: decimal("price", { precision: 12, scale: 2 }).notNull(),
	pricePerSqm: decimal("price_per_sqm", { precision: 10, scale: 2 }),
	sqmBuilt: integer("sqm_built"),
	sqmUseful: integer("sqm_useful"),
	bedrooms: integer("bedrooms"),
	bathrooms: integer("bathrooms"),
	zone: varchar("zone", { length: 255 }),
	address: text("address"),
	lat: decimal("lat", { precision: 10, scale: 8 }),
	lng: decimal("lng", { precision: 11, scale: 8 }),
	yearBuilt: integer("year_built"),
	energyCertificate: energyCertificateEnum("energy_certificate"),
	propertyType: propertyTypeEnum("property_type").notNull(),
	operationType: operationTypeEnum("operation_type").notNull(),
	status: propertyStatusEnum("status").notNull().default("disponible"),
	features: jsonb("features").$type<PropertyFeatures>(),
	communityFee: decimal("community_fee", { precision: 8, scale: 2 }),
	floor: varchar("floor", { length: 50 }),
	hasElevator: boolean("has_elevator").default(false),
	hasParking: boolean("has_parking").default(false),
	hasTerrace: boolean("has_terrace").default(false),
	hasPool: boolean("has_pool").default(false),
	hasAirConditioning: boolean("has_air_conditioning").default(false),
	tour360Url: text("tour_360_url"),
	isHighlighted: boolean("is_highlighted").default(false),
	// Portal sync
	syncIdealista: boolean("sync_idealista").default(false),
	syncFotocasa: boolean("sync_fotocasa").default(false),
	idealistaId: varchar("idealista_id", { length: 100 }),
	fotocasaId: varchar("fotocasa_id", { length: 100 }),
	// Metadata
	createdBy: uuid("created_by").references(() => users.id),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Property Images - multiple images per property
 */
export const propertyImages = pgTable("property_images", {
	id: uuid("id").primaryKey().defaultRandom(),
	propertyId: uuid("property_id")
		.references(() => properties.id, { onDelete: "cascade" })
		.notNull(),
	url: text("url").notNull(),
	order: integer("order").notNull().default(0),
	isPrimary: boolean("is_primary").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Leads - customer inquiries and potential clients
 */
export const leads = pgTable("leads", {
	id: uuid("id").primaryKey().defaultRandom(),
	propertyId: uuid("property_id").references(() => properties.id, {
		onDelete: "set null",
	}),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }),
	phone: varchar("phone", { length: 50 }),
	message: text("message"),
	source: leadSourceEnum("source").notNull().default("web"),
	status: leadStatusEnum("status").notNull().default("nuevo"),
	notes: text("notes"),
	assignedTo: uuid("assigned_to").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Appointments - scheduled property visits
 */
export const appointments = pgTable("appointments", {
	id: uuid("id").primaryKey().defaultRandom(),
	propertyId: uuid("property_id").references(() => properties.id),
	leadId: uuid("lead_id").references(() => leads.id),
	agentId: uuid("agent_id").references(() => users.id),
	scheduledAt: timestamp("scheduled_at").notNull(),
	status: appointmentStatusEnum("status").notNull().default("programada"),
	notes: text("notes"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Posts - blog articles
 */
export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().defaultRandom(),
	slug: varchar("slug", { length: 255 }).notNull().unique(),
	title: varchar("title", { length: 500 }).notNull(),
	excerpt: text("excerpt"),
	content: text("content").notNull(),
	featuredImage: text("featured_image"),
	category: varchar("category", { length: 100 }),
	status: postStatusEnum("status").notNull().default("borrador"),
	authorId: uuid("author_id").references(() => users.id),
	publishedAt: timestamp("published_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Sync Logs - track portal synchronization history
 */
export const syncLogs = pgTable("sync_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	propertyId: uuid("property_id")
		.references(() => properties.id, { onDelete: "cascade" })
		.notNull(),
	portal: varchar("portal", { length: 50 }).notNull(), // 'idealista' | 'fotocasa'
	action: varchar("action", { length: 50 }).notNull(), // 'create' | 'update' | 'delete'
	success: boolean("success").notNull(),
	response: jsonb("response"),
	errorMessage: text("error_message"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===========================================
// Custom Tables (Dynamic User-Defined Tables)
// ===========================================

/**
 * Custom Tables - user-defined table definitions
 * Stores metadata about custom tables created by the team
 */
export const customTables = pgTable("custom_tables", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: varchar("name", { length: 100 }).notNull(),
	slug: varchar("slug", { length: 100 }).notNull().unique(),
	description: text("description"),
	icon: varchar("icon", { length: 50 }),
	createdBy: uuid("created_by").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Custom Columns - column definitions for custom tables
 * Each custom table can have multiple columns of different types
 */
export const customColumns = pgTable("custom_columns", {
	id: uuid("id").primaryKey().defaultRandom(),
	tableId: uuid("table_id")
		.references(() => customTables.id, { onDelete: "cascade" })
		.notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	key: varchar("key", { length: 100 }).notNull(),
	columnType: columnTypeEnum("column_type").notNull(),
	isRequired: boolean("is_required").default(false),
	order: integer("order").notNull().default(0),
	options: jsonb("options").$type<string[]>(), // For dropdown options
	config: jsonb("config").$type<ColumnConfig>(), // Additional configuration
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Custom Rows - data rows for custom tables
 * Uses JSONB for flexible data storage
 */
export const customRows = pgTable("custom_rows", {
	id: uuid("id").primaryKey().defaultRandom(),
	tableId: uuid("table_id")
		.references(() => customTables.id, { onDelete: "cascade" })
		.notNull(),
	data: jsonb("data").notNull().$type<Record<string, unknown>>(),
	createdBy: uuid("created_by").references(() => users.id),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===========================================
// Relations
// ===========================================

export const usersRelations = relations(users, ({ many }) => ({
	properties: many(properties),
	leads: many(leads),
	posts: many(posts),
	appointments: many(appointments),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
	createdByUser: one(users, {
		fields: [properties.createdBy],
		references: [users.id],
	}),
	images: many(propertyImages),
	leads: many(leads),
	appointments: many(appointments),
	syncLogs: many(syncLogs),
}));

export const propertyImagesRelations = relations(propertyImages, ({ one }) => ({
	property: one(properties, {
		fields: [propertyImages.propertyId],
		references: [properties.id],
	}),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
	property: one(properties, {
		fields: [leads.propertyId],
		references: [properties.id],
	}),
	assignedToUser: one(users, {
		fields: [leads.assignedTo],
		references: [users.id],
	}),
	appointments: many(appointments),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
	property: one(properties, {
		fields: [appointments.propertyId],
		references: [properties.id],
	}),
	lead: one(leads, {
		fields: [appointments.leadId],
		references: [leads.id],
	}),
	agent: one(users, {
		fields: [appointments.agentId],
		references: [users.id],
	}),
}));

export const postsRelations = relations(posts, ({ one }) => ({
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id],
	}),
}));

export const syncLogsRelations = relations(syncLogs, ({ one }) => ({
	property: one(properties, {
		fields: [syncLogs.propertyId],
		references: [properties.id],
	}),
}));

export const customTablesRelations = relations(customTables, ({ one, many }) => ({
	createdByUser: one(users, {
		fields: [customTables.createdBy],
		references: [users.id],
	}),
	columns: many(customColumns),
	rows: many(customRows),
}));

export const customColumnsRelations = relations(customColumns, ({ one }) => ({
	table: one(customTables, {
		fields: [customColumns.tableId],
		references: [customTables.id],
	}),
}));

export const customRowsRelations = relations(customRows, ({ one }) => ({
	table: one(customTables, {
		fields: [customRows.tableId],
		references: [customTables.id],
	}),
	createdByUser: one(users, {
		fields: [customRows.createdBy],
		references: [users.id],
	}),
}));

// ===========================================
// Types
// ===========================================

export interface PropertyFeatures {
	heatingType?: string;
	orientation?: string;
	builtInWardrobes?: boolean;
	storageRoom?: boolean;
	furnished?: boolean;
	petsAllowed?: boolean;
	[key: string]: unknown;
}

// Inferred types for use in application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export type PropertyImage = typeof propertyImages.$inferSelect;
export type NewPropertyImage = typeof propertyImages.$inferInsert;

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type SyncLog = typeof syncLogs.$inferSelect;
export type NewSyncLog = typeof syncLogs.$inferInsert;

// Custom Tables types
export type CustomTable = typeof customTables.$inferSelect;
export type NewCustomTable = typeof customTables.$inferInsert;

export type CustomColumn = typeof customColumns.$inferSelect;
export type NewCustomColumn = typeof customColumns.$inferInsert;

export type CustomRow = typeof customRows.$inferSelect;
export type NewCustomRow = typeof customRows.$inferInsert;

/**
 * Column configuration options
 */
export interface ColumnConfig {
	placeholder?: string;
	min?: number;
	max?: number;
	pattern?: string;
	defaultValue?: unknown;
	[key: string]: unknown;
}

/**
 * Column types for display purposes
 */
export type ColumnType = "text" | "number" | "date" | "checkbox" | "file" | "link" | "dropdown";
