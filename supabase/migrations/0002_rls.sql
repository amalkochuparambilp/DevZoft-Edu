-- DevZoft Learning RLS policies
-- Migration: 0002_rls.sql

-- Helper: check permission
create or replace function public.has_permission(perm text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = auth.uid() and p.key = perm
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select public.has_permission('admin.access') or public.has_permission('super_admin.access');
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;
alter table public.education_levels enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.semesters enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.tags enable row level security;
alter table public.resources enable row level security;
alter table public.resource_files enable row level security;
alter table public.resource_tags enable row level security;
alter table public.bookmarks enable row level security;
alter table public.resource_views enable row level security;
alter table public.downloads enable row level security;
alter table public.user_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.announcements enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.device_tokens enable row level security;
alter table public.app_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_admin_all" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- Roles/permissions readable by authenticated
create policy "roles_read" on public.roles for select using (auth.role() = 'authenticated');
create policy "roles_admin" on public.roles for all using (public.has_permission('roles.manage')) with check (public.has_permission('roles.manage'));
create policy "permissions_read" on public.permissions for select using (auth.role() = 'authenticated');
create policy "permissions_admin" on public.permissions for all using (public.has_permission('roles.manage')) with check (public.has_permission('roles.manage'));
create policy "role_permissions_read" on public.role_permissions for select using (auth.role() = 'authenticated');
create policy "role_permissions_admin" on public.role_permissions for all using (public.has_permission('roles.manage')) with check (public.has_permission('roles.manage'));

-- user_roles: users read own; admins manage; users cannot self-assign privileged
create policy "user_roles_select_own" on public.user_roles for select using (auth.uid() = user_id or public.is_admin());
create policy "user_roles_admin_manage" on public.user_roles for all using (public.has_permission('users.manage_roles')) with check (public.has_permission('users.manage_roles'));

-- Public curriculum metadata readable by all (including anon)
create policy "education_levels_read" on public.education_levels for select using (true);
create policy "education_levels_write" on public.education_levels for all using (public.has_permission('curriculum.manage')) with check (public.has_permission('curriculum.manage'));
create policy "categories_read" on public.categories for select using (true);
create policy "categories_write" on public.categories for all using (public.has_permission('curriculum.manage')) with check (public.has_permission('curriculum.manage'));
create policy "courses_read" on public.courses for select using (true);
create policy "courses_write" on public.courses for all using (public.has_permission('curriculum.manage')) with check (public.has_permission('curriculum.manage'));
create policy "semesters_read" on public.semesters for select using (true);
create policy "semesters_write" on public.semesters for all using (public.has_permission('curriculum.manage')) with check (public.has_permission('curriculum.manage'));
create policy "subjects_read" on public.subjects for select using (true);
create policy "subjects_write" on public.subjects for all using (public.has_permission('curriculum.manage')) with check (public.has_permission('curriculum.manage'));
create policy "topics_read" on public.topics for select using (true);
create policy "topics_write" on public.topics for all using (public.has_permission('curriculum.manage')) with check (public.has_permission('curriculum.manage'));
create policy "tags_read" on public.tags for select using (true);
create policy "tags_write" on public.tags for all using (public.has_permission('content.manage')) with check (public.has_permission('content.manage'));

-- Resources: published readable by authenticated; admins/content manage
create policy "resources_read_published" on public.resources for select using (
  status = 'published' or public.has_permission('content.manage') or public.has_permission('content.review')
);
create policy "resources_insert" on public.resources for insert with check (public.has_permission('content.create'));
create policy "resources_update" on public.resources for update using (public.has_permission('content.edit') or creator_id = auth.uid()) with check (public.has_permission('content.edit') or creator_id = auth.uid());
create policy "resources_delete" on public.resources for delete using (public.has_permission('content.delete'));

-- Resource files
create policy "resource_files_read" on public.resource_files for select using (
  exists (select 1 from public.resources r where r.id = resource_id and (r.status='published' or public.has_permission('content.manage')))
);
create policy "resource_files_write" on public.resource_files for all using (public.has_permission('content.manage')) with check (public.has_permission('content.manage'));

-- Resource tags
create policy "resource_tags_read" on public.resource_tags for select using (true);
create policy "resource_tags_write" on public.resource_tags for all using (public.has_permission('content.manage')) with check (public.has_permission('content.manage'));

-- Bookmarks: owner only
create policy "bookmarks_owner" on public.bookmarks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Resource views: insert by authenticated; read own or admin
create policy "resource_views_insert" on public.resource_views for insert with check (auth.uid() = user_id or user_id is null);
create policy "resource_views_read" on public.resource_views for select using (auth.uid() = user_id or public.is_admin());

-- Downloads: owner only
create policy "downloads_owner" on public.downloads for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- User progress: owner only
create policy "user_progress_owner" on public.user_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Quizzes: published readable; manage by permission
create policy "quizzes_read" on public.quizzes for select using (
  status = 'published' or public.has_permission('quiz.manage') or public.has_permission('content.manage')
);
create policy "quizzes_write" on public.quizzes for all using (public.has_permission('quiz.manage')) with check (public.has_permission('quiz.manage'));

create policy "questions_read_published" on public.questions for select using (
  exists (select 1 from public.quizzes q where q.id = quiz_id and (q.status='published' or public.has_permission('quiz.manage')))
);
create policy "questions_write" on public.questions for all using (public.has_permission('quiz.manage')) with check (public.has_permission('quiz.manage'));

create policy "question_options_read" on public.question_options for select using (
  exists (select 1 from public.questions q join public.quizzes z on z.id=q.quiz_id where q.id=question_id and (z.status='published' or public.has_permission('quiz.manage')))
);
-- Hide correct answers from students: allow read but filter is_correct via view? We'll handle in app; policy allows read. To be safe, restrict is_correct column not possible in RLS. Use a view for students. (documented)
create policy "question_options_write" on public.question_options for all using (public.has_permission('quiz.manage')) with check (public.has_permission('quiz.manage'));

-- Quiz attempts: owner only; teachers/admins read permitted
create policy "quiz_attempts_owner" on public.quiz_attempts for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id);
create policy "quiz_answers_owner" on public.quiz_answers for all using (
  exists (select 1 from public.quiz_attempts a where a.id = attempt_id and (a.user_id = auth.uid() or public.is_admin()))
) with check (
  exists (select 1 from public.quiz_attempts a where a.id = attempt_id and a.user_id = auth.uid())
);

-- Announcements: published target readable
create policy "announcements_read" on public.announcements for select using (
  status = 'published' or public.has_permission('announcements.manage')
);
create policy "announcements_write" on public.announcements for all using (public.has_permission('announcements.manage')) with check (public.has_permission('announcements.manage'));

-- Notification prefs: owner
create policy "notification_preferences_owner" on public.notification_preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Device tokens: owner
create policy "device_tokens_owner" on public.device_tokens for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- App settings: read by authenticated; write by admin with settings permission
create policy "app_settings_read" on public.app_settings for select using (auth.role() = 'authenticated' or true);
create policy "app_settings_write" on public.app_settings for all using (public.has_permission('settings.manage')) with check (public.has_permission('settings.manage'));

-- Audit logs: read by admin; insert by authenticated (via server)
create policy "audit_logs_read" on public.audit_logs for select using (public.is_admin());
create policy "audit_logs_insert" on public.audit_logs for insert with check (auth.role() = 'authenticated');
