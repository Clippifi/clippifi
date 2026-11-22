-- Private beta: who asked to join (waitlist) and who may use the app (beta_allowlist).
-- IF NOT EXISTS so it is safe to run by hand in the Neon console and again by db:migrate.
CREATE TABLE IF NOT EXISTS "beta_allowlist" (
	"email" text PRIMARY KEY NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlist" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"status" text DEFAULT 'waiting' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
