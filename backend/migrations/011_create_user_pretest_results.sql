-- Migration: Create User Pretest Results Table
-- Date: 2025-12-10

CREATE TABLE IF NOT EXISTS user_pretest_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL,
    correct_count INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    recommended_level VARCHAR(50) NOT NULL,
    category_breakdown JSONB,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_user_pretest_results_user_id ON user_pretest_results(user_id);
CREATE INDEX idx_user_pretest_results_level ON user_pretest_results(recommended_level);

-- Log the migration
DO $$
BEGIN
    RAISE NOTICE 'Migration 011: Created user_pretest_results table';
END $$;
