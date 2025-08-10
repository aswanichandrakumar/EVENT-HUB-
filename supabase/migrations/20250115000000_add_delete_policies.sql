-- Add DELETE policies for registrations table
-- This allows admins to delete registrations from the admin dashboard

-- Create policy to allow deleting registrations (for admin dashboard)
CREATE POLICY "Allow deleting registrations" 
ON public.registrations 
FOR DELETE 
USING (true);

-- Create policy to allow updating registrations (for admin dashboard)
CREATE POLICY "Allow updating registrations" 
ON public.registrations 
FOR UPDATE 
USING (true);
