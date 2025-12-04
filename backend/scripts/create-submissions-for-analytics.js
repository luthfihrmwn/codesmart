const { pool } = require('../config/database');

async function createSubmissionsForAnalytics() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🚀 Creating submissions for analytics...');

        // Use existing users
        const assessorId = 6; // guru
        const studentId = 5;  // hasan

        console.log(`✅ Using Assessor ID: ${assessorId}, Student ID: ${studentId}`);

        // Get existing assignments
        const assignmentsResult = await client.query(`
            SELECT id, title FROM assignments
            WHERE id IN (27, 28, 29, 30, 31)
            ORDER BY id
        `);

        const assignments = assignmentsResult.rows;
        console.log(`✅ Found ${assignments.length} assignments`);

        // Create graded submissions with various scores
        const scores = [85, 92, 78, 88, 95];
        const feedbacks = [
            'Excellent work! Well structured code.',
            'Great job! Keep up the good work.',
            'Good effort, but needs some improvements.',
            'Very good! Nice implementation.',
            'Outstanding! Perfect execution.'
        ];

        for (let i = 0; i < assignments.length && i < scores.length; i++) {
            const assignment = assignments[i];
            const score = scores[i];
            const feedback = feedbacks[i];

            // Insert submission (with unique constraint on assignment_id, user_id)
            const submissionResult = await client.query(`
                INSERT INTO submissions (
                    assignment_id, user_id, file_url, file_name, status,
                    score, feedback, graded_at, graded_by, submitted_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() - INTERVAL '${i} days', $8, NOW() - INTERVAL '${i + 1} days')
                ON CONFLICT (assignment_id, user_id) DO NOTHING
                RETURNING id
            `, [
                assignment.id,
                studentId,
                `/uploads/analytics-dummy-${i + 1}.js`,
                `analytics-dummy-${i + 1}.js`,
                'graded',
                score,
                feedback,
                assessorId
            ]);

            console.log(`  ✅ Created submission for "${assignment.title}" - Score: ${score}/100`);
        }

        await client.query('COMMIT');

        // Verify the data
        const gradedCount = await client.query(`
            SELECT COUNT(*), ROUND(AVG(score), 2) as avg_score
            FROM submissions
            WHERE status = 'graded'
        `);

        console.log('\n📊 Data Verification:');
        console.log(`✅ Total Graded Submissions: ${gradedCount.rows[0].count}`);
        console.log(`✅ Average Score: ${gradedCount.rows[0].avg_score}`);
        console.log('\n✅ Analytics dummy submissions created successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error creating submissions:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Run the script
createSubmissionsForAnalytics()
    .then(() => {
        console.log('\n✅ Done! Refresh the analytics page.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Fatal error:', err);
        process.exit(1);
    });
