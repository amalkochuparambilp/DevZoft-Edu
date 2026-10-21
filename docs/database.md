# Database

Migrations live in `supabase/migrations/`. Apply in order:

1. `0001_initial_schema.sql` — tables, indexes, triggers
2. `0002_rls.sql` — row level security policies

Seed data: `supabase/seed/seed.sql`.

Core tables: profiles, roles, permissions, role_permissions, user_roles, education_levels, categories, courses, semesters, subjects, topics, resources, resource_files, resource_tags, tags, bookmarks, resource_views, downloads, user_progress, quizzes, questions, question_options, quiz_attempts, quiz_answers, announcements, notification_preferences, device_tokens, app_settings, audit_logs.
