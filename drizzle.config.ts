import { mkdirSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Same rule as src/server/db/index.ts: Neon when DATABASE_URL is set, else local PGlite.
// Migrations use Neon's direct (unpooled) connection when available.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
const pglitePath = process.env.PGLITE_PATH ?? "./.data/pglite";
if (!url) mkdirSync(pglitePath, { recursive: true });

export default defineConfig({
  schema: "./src/server/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  ...(url ? { dbCredentials: { url } } : { driver: "pglite", dbCredentials: { url: pglitePath } }),
});
