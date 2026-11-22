import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Private beta (src/server/access.ts). Emails are stored lowercase.

// People who asked to join. status: waiting → invited → approved.
export const waitlist = pgTable("waitlist", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  // "creator" or "brand": who to invite first.
  role: text("role").notNull().default("creator"),
  status: text("status").notNull().default("waiting"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Emails allowed in while PRIVATE_BETA is on. Kept apart from the user table so someone
// can be approved before they ever sign up. Entries are added in the database console,
// never in code: the repository is public.
export const betaAllowlist = pgTable("beta_allowlist", {
  email: text("email").primaryKey(),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
