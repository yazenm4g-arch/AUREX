-- Run this only after creating the first Supabase Auth user in the Dashboard.
-- Create the user with phone +212603821176 and the password you choose privately.
-- Then run this script in Supabase SQL Editor to grant the admin role.

update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where phone = '+212603821176';

-- Verify the setup without exposing the password:
select id, phone, phone_confirmed_at, raw_app_meta_data ->> 'role' as role
from auth.users
where phone = '+212603821176';
