-- =============================================
-- Migration: Create Notifications System
-- Description: Adds notifications table for real-time user notifications
-- =============================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'submission', 'assignment', 'grade', 'comment', 'system', 'warning', 'success', 'info'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(500), -- Optional link to related resource
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    metadata JSONB -- Additional data (e.g., assignment_id, submission_id, etc.)
);

-- Create indexes for better query performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    target_role VARCHAR(50), -- 'all', 'student', 'assessor', 'admin'
    target_level VARCHAR(50), -- 'all', 'fundamental', 'intermediate', 'advance'
    is_active BOOLEAN DEFAULT TRUE,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP
);

-- Create indexes for announcements
CREATE INDEX idx_announcements_target_role ON announcements(target_role);
CREATE INDEX idx_announcements_is_active ON announcements(is_active);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Create discussion forums table
CREATE TABLE IF NOT EXISTS discussions (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
    id SERIAL PRIMARY KEY,
    discussion_id INTEGER NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE, -- Mark as accepted solution
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for discussions
CREATE INDEX idx_discussions_module_id ON discussions(module_id);
CREATE INDEX idx_discussions_assignment_id ON discussions(assignment_id);
CREATE INDEX idx_discussions_user_id ON discussions(user_id);
CREATE INDEX idx_discussions_created_at ON discussions(created_at DESC);
CREATE INDEX idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX idx_discussion_replies_user_id ON discussion_replies(user_id);

-- Create function to automatically create notification
CREATE OR REPLACE FUNCTION create_notification_on_event()
RETURNS TRIGGER AS $$
BEGIN
    -- This function will be used by other triggers to create notifications
    -- Implementation will be done in application layer for flexibility
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new submissions (notify assessor)
CREATE OR REPLACE FUNCTION notify_assessor_on_submission()
RETURNS TRIGGER AS $$
DECLARE
    assessor_id INTEGER;
    assignment_title VARCHAR(255);
    student_name VARCHAR(255);
BEGIN
    -- Get assignment title
    SELECT title INTO assignment_title FROM assignments WHERE id = NEW.assignment_id;

    -- Get student name
    SELECT name INTO student_name FROM users WHERE id = NEW.user_id;

    -- Get all assessors (role = 'assessor')
    FOR assessor_id IN SELECT id FROM users WHERE role = 'assessor' LOOP
        INSERT INTO notifications (user_id, type, title, message, link, metadata)
        VALUES (
            assessor_id,
            'submission',
            'New Submission',
            student_name || ' submitted ' || assignment_title,
            '/src/pages/assessor/submissions-sidebar.html?submission=' || NEW.id,
            jsonb_build_object('submission_id', NEW.id, 'assignment_id', NEW.assignment_id, 'student_id', NEW.user_id)
        );
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_assessor_on_submission ON submissions;
CREATE TRIGGER trigger_notify_assessor_on_submission
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION notify_assessor_on_submission();

-- Create trigger for graded submissions (notify student)
CREATE OR REPLACE FUNCTION notify_student_on_grade()
RETURNS TRIGGER AS $$
DECLARE
    assignment_title VARCHAR(255);
    assessor_name VARCHAR(255);
BEGIN
    -- Only notify when grade changes from NULL to a value
    IF OLD.grade IS NULL AND NEW.grade IS NOT NULL THEN
        -- Get assignment title
        SELECT title INTO assignment_title FROM assignments WHERE id = NEW.assignment_id;

        -- Get assessor name
        SELECT name INTO assessor_name FROM users WHERE id = NEW.graded_by;

        INSERT INTO notifications (user_id, type, title, message, link, metadata)
        VALUES (
            NEW.user_id,
            'grade',
            'Assignment Graded',
            'Your submission for "' || assignment_title || '" has been graded. Score: ' || NEW.grade || '/100',
            '/src/pages/user/assignment.html?id=' || NEW.assignment_id,
            jsonb_build_object('submission_id', NEW.id, 'assignment_id', NEW.assignment_id, 'grade', NEW.grade)
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_notify_student_on_grade ON submissions;
CREATE TRIGGER trigger_notify_student_on_grade
    AFTER UPDATE ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION notify_student_on_grade();

-- Insert sample notifications for demo (optional)
-- This can be removed in production
INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at)
SELECT
    u.id,
    'system',
    'Welcome to CodeSmart',
    'Thank you for joining CodeSmart LMS. Explore modules and start learning!',
    NULL,
    FALSE,
    CURRENT_TIMESTAMP - INTERVAL '1 hour'
FROM users u
WHERE u.role = 'student' -- Only for students
LIMIT 5;

COMMENT ON TABLE notifications IS 'Stores user notifications for real-time updates';
COMMENT ON TABLE announcements IS 'System-wide announcements for targeted user groups';
COMMENT ON TABLE discussions IS 'Discussion forums per module or assignment';
COMMENT ON TABLE discussion_replies IS 'Replies to discussion threads';
