# Deployment

Admin CMS (Vercel):
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Build command: `pnpm build`.

Backend (Supabase):
- Apply migrations in `supabase/migrations/`.
- Run `supabase/seed/seed.sql`.
- Configure storage buckets and policies.
- Configure auth redirect URLs.

Android:
- Build APK/AAB via Flutter: `flutter build apk --release` and `flutter build appbundle --release`.
- Configure signing per Flutter docs.
