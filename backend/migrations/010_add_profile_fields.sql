-- Migration: Add profile fields (bio and address) to users table
-- Date: 2025-11-25
-- Description: Add additional profile fields for user profiles

-- Add bio and address columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;

-- Add comment for documentation
COMMENT ON COLUMN users.bio IS 'User biography or about section';
COMMENT ON COLUMN users.address IS 'User physical address';
