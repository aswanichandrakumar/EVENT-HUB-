-- Fix Delete Permissions for EventHub Admin Dashboard
-- Run this in your Supabase SQL Editor

-- Step 1: Check current policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 2: Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "Allow deleting registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow updating registrations" ON public.registrations;

-- Step 3: Create new policies with proper permissions
CREATE POLICY "Allow deleting registrations" 
ON public.registrations 
FOR DELETE 
USING (true);

CREATE POLICY "Allow updating registrations" 
ON public.registrations 
FOR UPDATE 
USING (true);

-- Step 4: Verify the policies were created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'registrations';

-- Step 5: Test delete operation (optional - will delete one test record)
-- INSERT INTO public.registrations (full_name, email, event_type, ticket_type) 
-- VALUES ('TEST DELETE', 'test@delete.com', 'Test Event', 'free');

-- DELETE FROM public.registrations WHERE email = 'test@delete.com';

-- Step 6: Show current registrations count
SELECT COUNT(*) as total_registrations FROM public.registrations;
