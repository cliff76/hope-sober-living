import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/data/env/server";

/**
 * Create and export a Drizzle DB instance backed by pg Pool.
 * This file centralizes the DB client used across the project.
 */
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool);

export default db;
