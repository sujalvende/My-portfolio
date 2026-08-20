-- ==============================================================================
-- Sujal Vende Portfolio — Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================
-- Run this complete script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_progress', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- 3. Create Admin Users Table
-- Only users listed in this table are recognized as admins with permission
-- to read, update, or delete inquiry data.
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 5. Inquiries RLS Policies

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Allow public insert" ON inquiries;
DROP POLICY IF EXISTS "Allow anonymous and authenticated insert" ON inquiries;
DROP POLICY IF EXISTS "Allow admin select" ON inquiries;
DROP POLICY IF EXISTS "Allow admin update" ON inquiries;
DROP POLICY IF EXISTS "Allow admin delete" ON inquiries;

-- POLICY 1: Anyone (public / anonymous / authenticated) can submit a new inquiry
CREATE POLICY "Allow anonymous and authenticated insert"
  ON inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- POLICY 2: Only authorized admins (listed in admin_users) can read inquiries
CREATE POLICY "Allow admin select"
  ON inquiries
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- POLICY 3: Only authorized admins can update inquiries (e.g. status changes)
CREATE POLICY "Allow admin update"
  ON inquiries
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- POLICY 4: Only authorized admins can delete inquiries
CREATE POLICY "Allow admin delete"
  ON inquiries
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

-- 6. Admin Users RLS Policies
DROP POLICY IF EXISTS "Allow admin read own admin status" ON admin_users;
CREATE POLICY "Allow admin read own admin status"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- ==============================================================================
-- HOW TO AUTHORIZE AN ADMIN USER:
-- 1. Create a user in Supabase Dashboard -> Authentication -> Users -> "Add User"
-- 2. Copy the user's UUID from the Authentication table.
-- 3. Run the following SQL to grant them admin access:
--
--    INSERT INTO admin_users (user_id)
--    VALUES ('PASTE-USER-UUID-HERE')
--    ON CONFLICT (user_id) DO NOTHING;
-- ==============================================================================
