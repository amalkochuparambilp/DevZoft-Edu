-- Storage buckets and policies
insert into storage.buckets (id, name, public) values ('thumbnails','thumbnails',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('resources','resources',false) on conflict (id) do nothing;

-- thumbnails public read
create policy "thumbnails_public_read" on storage.objects for select using (bucket_id='thumbnails');
create policy "thumbnails_admin_write" on storage.objects for insert with check (bucket_id='thumbnails' and auth.role()='authenticated');
create policy "resources_owner_read" on storage.objects for select using (bucket_id='resources' and auth.role()='authenticated');
create policy "resources_admin_write" on storage.objects for all using (bucket_id='resources' and auth.role()='authenticated') with check (bucket_id='resources' and auth.role()='authenticated');
