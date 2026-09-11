-- Run this script in the Supabase SQL Editor AFTER creating the first admin user.
--
-- How to create the admin user (Supabase Dashboard → Authentication → Users):
--   1. Click "Add user".
--   2. Enter the administrator's email address and a strong password.
--   3. Confirm the email address (or enable email confirmation and have the user confirm it).
--
-- Replace the email below with that administrator's email, then run this script to grant the admin role.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'admin@example.com';

-- Verify the setup (password is never exposed):
select
  id,
  email,
  email_confirmed_at,
  raw_app_meta_data ->> 'role' as role,
  raw_app_meta_data as app_metadata
from auth.users
where email = 'admin@example.com';

-- Expected result: role = 'admin'
