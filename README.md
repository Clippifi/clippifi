# Clippifi

Clipping and UGC campaign marketplace. Brands launch campaigns; creators post on
TikTok, Instagram and YouTube; Clippifi checks, counts and pays per verified view.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`.

Environment variables go in `.env.local` (never committed). Local runs use their own
database in `.data/` (PGlite), never production.

### Signing in locally

- Your own email: the code arrives by email as usual. Google sign-in works too.
- **Test accounts:** any address ending in `@clippifi.test` (for example
  `creator@clippifi.test`, `brand@clippifi.test`) gets its code printed in the terminal
  running `npm run dev`, not emailed. Use them to try both sides of the marketplace.
  This only works in development; the live site ignores it.

## How we ship

- `main` is what's live on clippifi.com. Work happens on feature branches.
- A feature deploys only when it's finished and has been tried locally: then it's merged
  to `main` and deployed once (`vercel deploy --prod`). Urgent fixes to live features are
  the only exception.

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4.
  Next 16 changed APIs: read `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`).
- UI: shadcn/ui (Radix), config in `components.json`, components in `src/components/ui`.
  Theme tokens and the `brand` color scale live in `src/app/globals.css`.
- Today's website and dashboard run on Firebase (auth + Firestore). This is temporary,
  to get the TikTok app approved quickly.
- Clippifi 2.0 backend (being built): Better Auth, Drizzle ORM on Postgres
  (PGlite locally, Neon in CI and production), Hono, Zod, TanStack Query, Vitest.
  Plan: kept outside the repo (ask the team).

## Brand

Source files: `clippifi-brand-kit/`. Web copies: `public/brand/`.
The coral brand color is a development placeholder; change it in one place,
the `--color-brand-*` scale in `src/app/globals.css`.
