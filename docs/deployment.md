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
- The GitHub Actions workflow builds and uploads an installable debug APK on pushes to `main` and manual runs. Pull requests run Flutter analysis and tests.
- Add `SUPABASE_URL` and either `SUPABASE_PUBLISHABLE_KEY` or `SUPABASE_ANON_KEY` under GitHub repository **Settings → Secrets and variables → Actions**. The APK needs these values to connect to Supabase.
- Download the `devzoft-learning-apk-<commit>` artifact from the completed workflow run. This debug-signed APK is for testing; configure a private Android release signing key before distributing a production APK or publishing to Google Play.
- Local builds: `cd apps/mobile && flutter build apk --debug --dart-define=SUPABASE_URL=https://your-project.supabase.co --dart-define=SUPABASE_PUBLISHABLE_KEY=your-publishable-key`.
