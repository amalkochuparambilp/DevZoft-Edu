# Architecture

DevZoft Learning is a monorepo:

- `apps/mobile` — Flutter Android student app
- `apps/admin` — Next.js admin CMS (TypeScript, Tailwind)
- `supabase` — PostgreSQL migrations, RLS, seed data, edge functions
- `packages/shared-types` — shared TypeScript contracts
- `docs` — documentation

Both apps connect to the same Supabase project. Supabase provides Auth, Postgres, Storage, and RLS. Privileged operations use server-side Supabase clients in Next.js (never the service-role key in the browser).
