-- Run this file with: psql -U postgres -f setup-postgres.sql
-- Or copy and paste into psql prompt

-- Drop existing user and database if they exist (to start fresh)
DROP DATABASE IF EXISTS codesmart;
DROP USER IF EXISTS luthfi;

-- Create user with password
CREATE USER luthfi WITH PASSWORD 'password123';

-- Create database owned by the user
CREATE DATABASE codesmart OWNER luthfi;

-- Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE codesmart TO luthfi;

-- Connect to the new database
\c codesmart

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO luthfi;

-- Show success message
SELECT 'Database setup complete!' AS status;
\q
