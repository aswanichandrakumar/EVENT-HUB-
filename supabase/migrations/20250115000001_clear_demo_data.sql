-- Clear all demo data from EventHub database
-- This removes all registrations and events

-- Clear all registrations
DELETE FROM public.registrations;

-- Clear all events
DELETE FROM public.events;

-- Reset auto-increment sequences (if any)
-- Note: UUID tables don't need sequence reset

-- Verify tables are empty
SELECT 'registrations' as table_name, COUNT(*) as count FROM public.registrations
UNION ALL
SELECT 'events' as table_name, COUNT(*) as count FROM public.events;
