-- Add admin override columns to submissions table
ALTER TABLE submissions 
ADD COLUMN IF NOT EXISTS admin_override BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_override_by INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS admin_override_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS admin_override_reason TEXT;

-- Create audit_logs table if not exists
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

