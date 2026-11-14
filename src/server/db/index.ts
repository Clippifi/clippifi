import "server-only";
import { PGlite } from "@electric-sql/pglite";
import { drizzle as drizzlePglite } from "drizzle-orm/pglite";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// DATABASE_URL set (Vercel, CI): real Postgres on Neon.
// Not set (local dev): embedded Postgres (PGlite) in ./.data/pglite (or PGLITE_PATH), no Docker.
// Run `npm run db:migrate` to apply migrations to whichever one is active.
type Database = ReturnType<typeof drizzlePostgres<typeof schema>>;

function createDb(): Database {
  const url = process.env.DATABASE_URL;
  if (url) return drizzlePostgres(postgres(url, { prepare: false }), { schema });
  return drizzlePglite(new PGlite(process.env.PGLITE_PATH ?? "./.data/pglite"), { schema }) as unknown as Database;
}

// The connection opens on first use, not on import, so builds and other processes
// never open the local database folder by accident. One instance per process,
// reused across hot reloads in development.
const globalForDb = globalThis as unknown as { db?: Database };
function getDb() {
  globalForDb.db ??= createDb();
  return globalForDb.db;
}

export const db = new Proxy({} as Database, {
  get(_, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
