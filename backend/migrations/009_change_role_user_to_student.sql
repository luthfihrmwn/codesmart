-- Migration: Change role 'user' to 'student'
-- Date: 2025-11-24

-- Step 1: Drop existing constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Step 2: Update existing 'user' role to 'student'
UPDATE users SET role = 'student' WHERE role = 'user';

-- Step 3: Add new constraint with 'student' instead of 'user'
ALTER TABLE users ADD CONSTRAINT users_role_check
CHECK (role IN ('admin', 'assessor', 'student'));

-- Update any other tables that might reference 'user' role
-- (Add additional updates here if needed)

-- Log the migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 009: Changed role from user to student';
END $$;
