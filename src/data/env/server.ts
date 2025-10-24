import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Prefer a full DATABASE_URL; fallback to individual parts below.
    DATABASE_URL: z.string().url().optional(),
    DB_USER: z.string().min(1).optional(),
    DB_PASSWORD: z.string().min(1).optional(),
    DB_HOSTNAME: z.string().min(1).optional(),
    DB_PORT: z.string().min(1).optional(),
    DB_NAME: z.string().min(1).optional(),
    DB_DISABLE_SSL: z.string().min(1).optional(),
    // Server-only secret used by Clerk
    CLERK_SECRET_KEY: z.string().min(1),
  },
  createFinalSchema: (schema) => {
    return z.object(schema).transform((val) => {
      const {
        DATABASE_URL,
        DB_USER,
        DB_PASSWORD,
        DB_HOSTNAME,
        DB_PORT,
        DB_NAME,
        DB_DISABLE_SSL,
        CLERK_SECRET_KEY,
        ...rest
      } = val;

      const hasPieces =
        !!DB_USER && !!DB_PASSWORD && !!DB_HOSTNAME && !!DB_PORT && !!DB_NAME;

      const noSSL =
        DB_DISABLE_SSL &&
        (DB_DISABLE_SSL.toLowerCase() === "true" ||
          DB_DISABLE_SSL.toLowerCase() === "yes");

      const finalDatabaseUrl =
        DATABASE_URL && DATABASE_URL.length > 0
          ? DATABASE_URL
          : hasPieces
            ? `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}${noSSL ? "" : "?sslmode=require"}`
            : undefined;

      if (!finalDatabaseUrl) {
        throw new Error(
          "DATABASE_URL is required. Provide DATABASE_URL or all of DB_USER, DB_PASSWORD, DB_HOSTNAME, DB_PORT, DB_NAME."
        );
      }

      return {
        ...rest,
        CLERK_SECRET_KEY,
        DATABASE_URL: finalDatabaseUrl,
      };
    });
  },
  emptyStringAsUndefined: true,
  // Safe: library only inlines keys declared in `client` below, not server keys
  experimental__runtimeEnv: process.env,
});