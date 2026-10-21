-- Seed data
-- Roles
insert into public.roles (name, description, sort_order) values
 ('Super Admin','Full platform administration',0),
 ('Admin','Platform operations',1),
 ('Content Manager','Content management',2),
 ('Editor','Content editing',3),
 ('Teacher','Assigned materials',4),
 ('Student','Student access',5)
on conflict (name) do nothing;

-- Permissions
insert into public.permissions (key, description) values
 ('admin.access','Access admin CMS'),
 ('super_admin.access','Super admin access'),
 ('users.manage','Manage users'),
 ('users.manage_roles','Manage user roles'),
 ('content.create','Create content'),
 ('content.edit','Edit content'),
 ('content.delete','Delete content'),
 ('content.manage','Manage content'),
 ('content.review','Review content'),
 ('curriculum.manage','Manage curriculum'),
 ('quiz.manage','Manage quizzes'),
 ('announcements.manage','Manage announcements'),
 ('settings.manage','Manage settings'),
 ('roles.manage','Manage roles'),
 ('audit.read','Read audit logs'),
 ('files.manage','Manage files')
on conflict (key) do nothing;

-- Map permissions to roles
-- Super Admin: all
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p where r.name='Super Admin'
on conflict do nothing;
-- Admin
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('admin.access','users.manage','content.create','content.edit','content.delete','content.manage','content.review','curriculum.manage','quiz.manage','announcements.manage','settings.manage','files.manage','audit.read')
where r.name='Admin' on conflict do nothing;
-- Content Manager
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('admin.access','content.create','content.edit','content.delete','content.manage','content.review','curriculum.manage','quiz.manage','announcements.manage','files.manage')
where r.name='Content Manager' on conflict do nothing;
-- Editor
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('admin.access','content.create','content.edit','content.review')
where r.name='Editor' on conflict do nothing;
-- Teacher
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r join public.permissions p on p.key in ('admin.access','content.create','content.edit','quiz.manage')
where r.name='Teacher' on conflict do nothing;

-- Education levels
insert into public.education_levels (name, slug, sort_order) values
 ('School','school',1),('College','college',2)
on conflict (slug) do nothing;

-- School classes 1-12 as categories under school
do $$
declare lvl uuid;
begin
  select id into lvl from public.education_levels where slug='school';
  for i in 1..12 loop
    insert into public.categories (name, slug, kind, education_level_id, sort_order)
    values ('Class '||i, 'class-'||i, 'class', lvl, i) on conflict do nothing;
  end loop;
end $$;

-- School subjects
do $$
declare lvl uuid; c uuid; subj text;
begin
  select id into lvl from public.education_levels where slug='school';
  foreach subj in array['Mathematics','Science','Social Science','English','Languages'] loop
    insert into public.categories (name, slug, kind, education_level_id, sort_order)
    values (subj, lower(replace(subj,' ','-')), 'subject', lvl, 0) on conflict do nothing;
  end loop;
end $$;

-- College degree programs
do $$
declare lvl uuid;
begin
  select id into lvl from public.education_levels where slug='college';
  insert into public.courses (name, slug, education_level_id, sort_order) values
   ('Arts and Humanities','arts-humanities',lvl,1),
   ('Science','science',lvl,2),
   ('Commerce','commerce',lvl,3),
   ('Computer Science and IT','cs-it',lvl,4),
   ('Engineering','engineering',lvl,5),
   ('Management','management',lvl,6)
  on conflict do nothing;
end $$;

-- App settings defaults
insert into public.app_settings (key, value) values
 ('app_name', '"DevZoft Learning"'::jsonb),
 ('theme_default', '"system"'::jsonb),
 ('maintenance_mode', 'false'::jsonb),
 ('max_upload_size_mb', '50'::jsonb),
 ('allowed_file_types', '["pdf","png","jpg","jpeg","mp3","mp4"]'::jsonb)
on conflict (key) do nothing;

-- Resource categories
insert into public.categories (name, slug, kind, sort_order) values
 ('Study Notes','study-notes','resource',1),
 ('Worksheets','worksheets','resource',2),
 ('Question Papers','question-papers','resource',3),
 ('E-Books','e-books','resource',4),
 ('Video Lessons','video-lessons','resource',5),
 ('Audio Lessons','audio-lessons','resource',6)
on conflict do nothing;
