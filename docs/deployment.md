# Deployment

Admin CMS (Vercel):
- Set `NEXT_PUBLIC_SUPABASE_URL` and either `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel. The CMS supports both key names; prefer the publishable key for new deployments.
- Apply the Supabase migrations and seed data, then assign each CMS user's role and permissions. A signed-in account without `admin.access` cannot use the CMS; content changes also require the matching management permission.
- Build command: `pnpm build`.

Backend (Supabase):
- Apply migrations in `supabase/migrations/`.
- Run `supabase/seed/seed.sql`.
- Configure storage buckets and policies.
- Configure auth redirect URLs.

Android:
- Build APK/AAB via Flutter: `flutter build apk --release` and `flutter build appbundle --release`.
- Configure signing per Flutter docs.
