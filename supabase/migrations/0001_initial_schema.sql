-- DevZoft Learning initial schema
-- Migration: 0001_initial_schema.sql

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.resource_type as enum ('pdf','notes','ebook','video','audio','article','worksheet','question_paper','external_link');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.resource_status as enum ('draft','in_review','published','unpublished','archived','scheduled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.question_type as enum ('mcq','single_choice','true_false');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.announcement_status as enum ('draft','scheduled','published','unpublished');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.target_audience as enum ('all','students','teachers','admins');
exception when duplicate_object then null; end $$;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  avatar_url text,
  bio text,
  theme text default 'system',
  notification_email boolean default true,
  notification_push boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Roles
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Permissions
create table if not exists public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- Role permissions
create table if not exists public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- User roles
create table if not exists public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  assigned_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- Education levels
create table if not exists public.education_levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Categories (curriculum + resource categories)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  kind text not null default 'resource',
  parent_id uuid references public.categories(id) on delete set null,
  education_level_id uuid references public.education_levels(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, education_level_id, parent_id)
);

-- Courses
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  education_level_id uuid references public.education_levels(id) on delete cascade,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, education_level_id)
);

-- Semesters
create table if not exists public.semesters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  name text not null,
  number int,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Subjects
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  education_level_id uuid references public.education_levels(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  semester_id uuid references public.semesters(id) on delete set null,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Topics
create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  name text not null,
  slug text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug, subject_id)
);

-- Tags
create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- Resources
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  resource_type public.resource_type not null default 'article',
  status public.resource_status not null default 'draft',
  featured boolean not null default false,
  education_level_id uuid references public.education_levels(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  semester_id uuid references public.semesters(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  language text default 'en',
  thumbnail_url text,
  file_url text,
  external_url text,
  seo_title text,
  seo_description text,
  scheduled_at timestamptz,
  published_at timestamptz,
  view_count bigint not null default 0,
  download_count bigint not null default 0,
  creator_id uuid references auth.users(id) on delete set null,
  last_editor_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resource_files (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  bucket text not null,
  file_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resource_tags (
  resource_id uuid not null references public.resources(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (resource_id, tag_id)
);

-- Bookmarks
create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, resource_id)
);

-- Resource views
create table if not exists public.resource_views (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  resource_id uuid not null references public.resources(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

-- Downloads
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  resource_file_id uuid references public.resource_files(id) on delete set null,
  downloaded_at timestamptz not null default now()
);

-- User progress
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.resources(id) on delete cascade,
  progress_percent int not null default 0,
  last_position text,
  updated_at timestamptz not null default now(),
  unique (user_id, resource_id)
);

-- Quizzes
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  status public.resource_status not null default 'draft',
  featured boolean not null default false,
  education_level_id uuid references public.education_levels(id) on delete set null,
  course_id uuid references public.courses(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  time_limit_seconds int,
  passing_score int default 50,
  creator_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type public.question_type not null default 'mcq',
  points int not null default 1,
  sort_order int not null default 0,
  explanation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric,
  passed boolean,
  time_taken_seconds int,
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean,
  points_earned numeric default 0,
  created_at timestamptz not null default now()
);

-- Announcements
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  target_audience public.target_audience not null default 'all',
  status public.announcement_status not null default 'draft',
  scheduled_at timestamptz,
  published_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Notification preferences
create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  push_enabled boolean not null default true,
  email_enabled boolean not null default true,
  categories jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Device tokens
create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  platform text not null default 'android',
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);

-- App settings
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Audit logs
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_resources_status on public.resources(status);
create index if not exists idx_resources_featured on public.resources(featured);
create index if not exists idx_resources_education_level on public.resources(education_level_id);
create index if not exists idx_resources_category on public.resources(category_id);
create index if not exists idx_resources_subject on public.resources(subject_id);
create index if not exists idx_resources_published_at on public.resources(published_at desc);
create index if not exists idx_resources_slug on public.resources(slug);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id);
create index if not exists idx_downloads_user on public.downloads(user_id);
create index if not exists idx_resource_views_resource on public.resource_views(resource_id);
create index if not exists idx_quiz_attempts_user on public.quiz_attempts(user_id);
create index if not exists idx_audit_logs_created on public.audit_logs(created_at desc);

-- Full text search on resources
alter table public.resources add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description,'')), 'B')
  ) stored;
create index if not exists idx_resources_search on public.resources using gin(search_vector);

-- Updated_at trigger
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ declare t text; begin
  for t in select unnest(array['profiles','education_levels','categories','courses','semesters','subjects','topics','resources','quizzes','questions','announcements','app_settings']) loop
    execute format('drop trigger if exists trg_updated_at on public.%I', t);
    execute format('create trigger trg_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  insert into public.notification_preferences (user_id) values (new.id) on conflict (user_id) do nothing;
  -- assign student role by default
  insert into public.user_roles (user_id, role_id)
  select new.id, r.id from public.roles r where r.name = 'Student'
  on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();
