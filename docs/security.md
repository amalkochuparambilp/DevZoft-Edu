# Security

- RLS enabled on all user/privileged tables.
- Students read only published resources and own private records.
- Role checks via `has_permission()` and `is_admin()` SQL functions.
- Service-role key never exposed to client.
- Admin routes protected by middleware and server-side session checks.
- Quiz answer keys hidden from students until submission; scoring validated server-side where required.
- Audit logs record sensitive admin actions.
