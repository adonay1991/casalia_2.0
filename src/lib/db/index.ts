import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Database client using Drizzle ORM with postgres.js driver
 *
 * Uses connection pooling optimized for serverless environments.
 * The connection is created lazily on first use.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres.js client with connection pooling
// For serverless, we use a single connection per request
const client = postgres(connectionString, {
	max: 1, // Single connection for serverless
	idle_timeout: 20, // Close idle connections after 20 seconds
	connect_timeout: 10, // Connection timeout in seconds
});

// Create drizzle instance with schema for type-safe queries
export const db = drizzle(client, { schema });

// Export all schema elements for convenience
export * from "./schema";

// Type for the database instance
export type Database = typeof db;
