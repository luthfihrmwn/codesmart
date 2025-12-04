-- ===============================================
-- Insert Dummy Data for Analytics Dashboard
-- ===============================================

-- Get guru user ID (assessor)
DO $$
DECLARE
    assessor_id INTEGER;
    student_id INTEGER;
    module_fund_id INTEGER;
    module_inter_id INTEGER;
    module_adv_id INTEGER;
    assignment1_id INTEGER;
    assignment2_id INTEGER;
    assignment3_id INTEGER;
BEGIN
    -- Get assessor ID (guru)
    SELECT id INTO assessor_id FROM users WHERE username = 'guru';

    -- Get or create a student user
    INSERT INTO users (username, email, password, name, role, current_level, pretest_score)
    VALUES ('student_dummy', 'student.dummy@codesmart.com', '$2a$10$KIX5Z9Z9Z9Z9Z9Z9Z9Z9ZeX', 'Student Dummy', 'student', 'fundamental', 75)
    ON CONFLICT (username) DO UPDATE SET username = 'student_dummy'
    RETURNING id INTO student_id;

    -- Get module IDs
    SELECT id INTO module_fund_id FROM modules WHERE level = 'fundamental' LIMIT 1;
    SELECT id INTO module_inter_id FROM modules WHERE level = 'intermediate' LIMIT 1;
    SELECT id INTO module_adv_id FROM modules WHERE level = 'advance' LIMIT 1;

    -- Create assignments if they don't exist
    INSERT INTO assignments (module_id, title, description, due_date, max_score, created_by)
    VALUES
        (module_fund_id, 'Analytics Test Assignment 1', 'Test assignment for analytics', NOW() + INTERVAL '7 days', 100, assessor_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO assignment1_id;

    IF assignment1_id IS NULL THEN
        SELECT id INTO assignment1_id FROM assignments WHERE module_id = module_fund_id LIMIT 1;
    END IF;

    INSERT INTO assignments (module_id, title, description, due_date, max_score, created_by)
    VALUES
        (module_inter_id, 'Analytics Test Assignment 2', 'Test assignment for analytics', NOW() + INTERVAL '7 days', 100, assessor_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO assignment2_id;

    IF assignment2_id IS NULL THEN
        SELECT id INTO assignment2_id FROM assignments WHERE module_id = module_inter_id LIMIT 1;
    END IF;

    INSERT INTO assignments (module_id, title, description, due_date, max_score, created_by)
    VALUES
        (module_adv_id, 'Analytics Test Assignment 3', 'Test assignment for analytics', NOW() + INTERVAL '7 days', 100, assessor_id)
    ON CONFLICT DO NOTHING
    RETURNING id INTO assignment3_id;

    IF assignment3_id IS NULL THEN
        SELECT id INTO assignment3_id FROM assignments WHERE module_id = module_adv_id LIMIT 1;
    END IF;

    -- Insert submissions with various scores (graded)
    INSERT INTO submissions (assignment_id, user_id, file_path, status, score, feedback, graded_at, graded_by, submitted_at)
    VALUES
        (assignment1_id, student_id, '/uploads/dummy1.pdf', 'graded', 95, 'Excellent work!', NOW() - INTERVAL '1 day', assessor_id, NOW() - INTERVAL '2 days'),
        (assignment1_id, student_id, '/uploads/dummy2.pdf', 'graded', 88, 'Good job!', NOW() - INTERVAL '3 days', assessor_id, NOW() - INTERVAL '4 days'),
        (assignment2_id, student_id, '/uploads/dummy3.pdf', 'graded', 76, 'Needs improvement', NOW() - INTERVAL '5 days', assessor_id, NOW() - INTERVAL '6 days'),
        (assignment2_id, student_id, '/uploads/dummy4.pdf', 'graded', 92, 'Great work!', NOW() - INTERVAL '7 days', assessor_id, NOW() - INTERVAL '8 days'),
        (assignment3_id, student_id, '/uploads/dummy5.pdf', 'graded', 58, 'Below expectations', NOW() - INTERVAL '10 days', assessor_id, NOW() - INTERVAL '11 days')
    ON CONFLICT DO NOTHING;

    -- Insert pending submissions
    INSERT INTO submissions (assignment_id, user_id, file_path, status, submitted_at)
    VALUES
        (assignment1_id, student_id, '/uploads/pending1.pdf', 'submitted', NOW() - INTERVAL '1 hour'),
        (assignment2_id, student_id, '/uploads/pending2.pdf', 'submitted', NOW() - INTERVAL '3 hours')
    ON CONFLICT DO NOTHING;

    -- Insert user activity for engagement metrics
    INSERT INTO user_activity (user_id, activity_type, activity_date)
    VALUES
        (student_id, 'login', NOW()),
        (student_id, 'login', NOW() - INTERVAL '1 day'),
        (student_id, 'login', NOW() - INTERVAL '2 days'),
        (student_id, 'assignment_view', NOW() - INTERVAL '1 day'),
        (student_id, 'assignment_view', NOW() - INTERVAL '3 days'),
        (student_id, 'submission', NOW() - INTERVAL '2 days'),
        (student_id, 'submission', NOW() - INTERVAL '5 days')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Analytics dummy data inserted successfully!';
    RAISE NOTICE 'Student ID: %', student_id;
    RAISE NOTICE 'Assignment IDs: %, %, %', assignment1_id, assignment2_id, assignment3_id;
END $$;

-- Verify the data
SELECT
    'Graded Submissions' as type,
    COUNT(*) as count,
    ROUND(AVG(score), 2) as avg_score
FROM submissions
WHERE status = 'graded';

SELECT
    'Pending Submissions' as type,
    COUNT(*) as count
FROM submissions
WHERE status = 'submitted';

SELECT
    'User Activity Records' as type,
    COUNT(*) as count
FROM user_activity;
