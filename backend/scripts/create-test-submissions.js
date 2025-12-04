const { pool } = require('../config/database');

async function createTestSubmissions() {
    try {
        console.log('Creating test submissions...\n');

        // Get a regular user (student)
        const userResult = await pool.query("SELECT id FROM users WHERE role = 'user' LIMIT 1");
        if (userResult.rows.length === 0) {
            console.log('❌ No student user found in database');
            process.exit(1);
        }
        const studentId = userResult.rows[0].id;
        console.log(`✅ Using student ID: ${studentId}`);

        // Get all assignments
        const assignmentsResult = await pool.query('SELECT id, title FROM assignments ORDER BY id');
        console.log(`✅ Found ${assignmentsResult.rows.length} assignments\n`);

        // Create 1 submission per assignment (some pending, some graded)
        const submissions = [];

        for (let i = 0; i < assignmentsResult.rows.length; i++) {
            const assignment = assignmentsResult.rows[i];

            // Alternate between pending and graded
            const isGraded = i % 2 === 0;

            if (isGraded) {
                // Create graded submission
                const result = await pool.query(`
                    INSERT INTO submissions (
                        user_id,
                        assignment_id,
                        file_url,
                        file_name,
                        submission_text,
                        status,
                        score,
                        feedback,
                        submitted_at,
                        graded_at,
                        graded_by
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day', 1)
                    RETURNING id, status
                `, [
                    studentId,
                    assignment.id,
                    `/uploads/submissions/test_${assignment.id}.zip`,
                    `submission_${assignment.id}.zip`,
                    'This is a test submission for ' + assignment.title,
                    'graded',
                    75 + Math.floor(Math.random() * 25), // Score between 75-100
                    'Good work! Keep it up.'
                ]);

                submissions.push(result.rows[0]);
                console.log(`✅ Created GRADED submission for: ${assignment.title} (ID: ${result.rows[0].id})`);
            } else {
                // Create pending submission
                const result = await pool.query(`
                    INSERT INTO submissions (
                        user_id,
                        assignment_id,
                        file_url,
                        file_name,
                        submission_text,
                        status,
                        submitted_at
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '2 days')
                    RETURNING id, status
                `, [
                    studentId,
                    assignment.id,
                    `/uploads/submissions/test_${assignment.id}.zip`,
                    `submission_${assignment.id}.zip`,
                    'This is a test submission for ' + assignment.title,
                    'pending'
                ]);

                submissions.push(result.rows[0]);
                console.log(`✅ Created PENDING submission for: ${assignment.title} (ID: ${result.rows[0].id})`);
            }
        }

        console.log(`\n✅ Successfully created ${submissions.length} test submissions`);

        // Show summary
        const summary = await pool.query(`
            SELECT
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
                COUNT(CASE WHEN status = 'graded' THEN 1 END) as graded
            FROM submissions
        `);

        console.log('\n📊 Submissions Summary:');
        console.table(summary.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createTestSubmissions();
