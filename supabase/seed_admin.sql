-- ==============================================================================
-- SHORT BREAK - PROMOTE USER TO ADMIN
-- ==============================================================================
-- Instructions:
-- 1. Sign up on the Short Break website with your admin email (e.g. admin@shortbreak.com)
-- 2. In your Supabase SQL Editor, replace 'admin@shortbreak.com' with your actual email below and execute:

UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@shortbreak.com';

-- Alternatively, promote by user id (UUID):
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE id = 'your-user-uuid-here';

-- Verify current admin users:
SELECT id, name, email, role, created_at 
FROM public.profiles 
WHERE role = 'admin';
