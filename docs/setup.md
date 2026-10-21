# Setup

1. Create a Supabase project.
2. Apply `supabase/migrations/*.sql` then `supabase/seed/seed.sql`.
3. Copy `apps/admin/.env.example` to `apps/admin/.env.local` and fill values.
4. `cd apps/admin && pnpm install && pnpm dev`.
5. Flutter: `cd apps/mobile && flutter pub get && flutter run --dart-define=SUPABASE_URL=https://your-project.supabase.co --dart-define=SUPABASE_ANON_KEY=your-anon-key`.

Use the Supabase project URL and publishable/anon key from the Supabase project settings. Do not use the service-role key in either client app.
