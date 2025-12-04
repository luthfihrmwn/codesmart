const { pool } = require('../config/database');

async function insertAnalyticsDummyData() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('🚀 Inserting analytics dummy data...');

        // Get guru user ID (assessor)
        const guruResult = await client.query(`SELECT id FROM users WHERE username = 'guru'`);
        const assessorId = guruResult.rows[0]?.id;

        if (!assessorId) {
            throw new Error('Guru user not found');
        }

        console.log('✅ Found assessor ID:', assessorId);

        // Use existing user hasan (ID: 5)
        const studentResult = await client.query(`
            SELECT id FROM users WHERE id = 5
        `);

        const studentId = studentResult.rows[0].id;
        console.log('✅ Student ID:', studentId);

        // Get module IDs
        const moduleFundResult = await client.query(`SELECT id FROM modules WHERE level = 'fundamental' LIMIT 1`);
        const moduleInterResult = await client.query(`SELECT id FROM modules WHERE level = 'intermediate' LIMIT 1`);
        const moduleAdvResult = await client.query(`SELECT id FROM modules WHERE level = 'advance' LIMIT 1`);

        const moduleFundId = moduleFundResult.rows[0]?.id;
        const moduleInterId = moduleInterResult.rows[0]?.id;
        const moduleAdvId = moduleAdvResult.rows[0]?.id;

        console.log('✅ Module IDs:', { fundamental: moduleFundId, intermediate: moduleInterId, advance: moduleAdvId });

        // Create assignments
        const assignment1Result = await client.query(`
            INSERT INTO assignments (module_id, title, description, due_date, max_score, created_by)
            VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', $4, $5)
            RETURNING id
        `, [moduleFundId, 'Analytics Test Assignment 1', 'Test assignment for analytics', 100, assessorId]);

        const assignment2Result = await client.query(`
            INSERT INTO assignments (module_id, title, description, due_date, max_score, created_by)
            VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', $4, $5)
            RETURNING id
        `, [moduleInterId, 'Analytics Test Assignment 2', 'Test assignment for analytics', 100, assessorId]);

        const assignment3Result = await client.query(`
            INSERT INTO assignments (module_id, title, description, due_date, max_score, created_by)
            VALUES ($1, $2, $3, NOW() + INTERVAL '7 days', $4, $5)
            RETURNING id
        `, [moduleAdvId, 'Analytics Test Assignment 3', 'Test assignment for analytics', 100, assessorId]);

        const assignment1Id = assignment1Result.rows[0].id;
        const assignment2Id = assignment2Result.rows[0].id;
        const assignment3Id = assignment3Result.rows[0].id;

        console.log('✅ Assignment IDs:', { a1: assignment1Id, a2: assignment2Id, a3: assignment3Id });

        // Insert graded submissions with various scores
        await client.query(`
            INSERT INTO submissions (assignment_id, user_id, file_path, status, score, feedback, graded_at, graded_by, submitted_at)
            VALUES
                ($1, $2, '/uploads/dummy1.pdf', 'graded', 95, 'Excellent work!', NOW() - INTERVAL '1 day', $3, NOW() - INTERVAL '2 days'),
                ($1, $2, '/uploads/dummy2.pdf', 'graded', 88, 'Good job!', NOW() - INTERVAL '3 days', $3, NOW() - INTERVAL '4 days'),
                ($4, $2, '/uploads/dummy3.pdf', 'graded', 76, 'Needs improvement', NOW() - INTERVAL '5 days', $3, NOW() - INTERVAL '6 days'),
                ($4, $2, '/uploads/dummy4.pdf', 'graded', 92, 'Great work!', NOW() - INTERVAL '7 days', $3, NOW() - INTERVAL '8 days'),
                ($5, $2, '/uploads/dummy5.pdf', 'graded', 58, 'Below expectations', NOW() - INTERVAL '10 days', $3, NOW() - INTERVAL '11 days')
        `, [assignment1Id, studentId, assessorId, assignment2Id, assignment3Id]);

        console.log('✅ Inserted 5 graded submissions');

        // Insert pending submissions
        await client.query(`
            INSERT INTO submissions (assignment_id, user_id, file_path, status, submitted_at)
            VALUES
                ($1, $2, '/uploads/pending1.pdf', 'submitted', NOW() - INTERVAL '1 hour'),
                ($3, $2, '/uploads/pending2.pdf', 'submitted', NOW() - INTERVAL '3 hours')
        `, [assignment1Id, studentId, assignment2Id]);

        console.log('✅ Inserted 2 pending submissions');

        // Check if user_activity table exists
        const tableCheck = await client.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_schema = 'public'
                AND table_name = 'user_activity'
            )
        `);

        if (tableCheck.rows[0].exists) {
            // Insert user activity for engagement metrics
            await client.query(`
                INSERT INTO user_activity (user_id, activity_type, activity_date)
                VALUES
                    ($1, 'login', NOW()),
                    ($1, 'login', NOW() - INTERVAL '1 day'),
                    ($1, 'login', NOW() - INTERVAL '2 days'),
                    ($1, 'assignment_view', NOW() - INTERVAL '1 day'),
                    ($1, 'assignment_view', NOW() - INTERVAL '3 days'),
                    ($1, 'submission', NOW() - INTERVAL '2 days'),
                    ($1, 'submission', NOW() - INTERVAL '5 days')
            `, [studentId]);

            console.log('✅ Inserted user activity records');
        } else {
            console.log('⚠️ user_activity table not found, skipping activity records');
        }

        await client.query('COMMIT');

        // Verify the data
        const gradedCount = await client.query(`SELECT COUNT(*), ROUND(AVG(score), 2) as avg_score FROM submissions WHERE status = 'graded'`);
        const pendingCount = await client.query(`SELECT COUNT(*) FROM submissions WHERE status = 'submitted'`);

        console.log('\n📊 Data Verification:');
        console.log(`✅ Graded Submissions: ${gradedCount.rows[0].count} (avg score: ${gradedCount.rows[0].avg_score})`);
        console.log(`✅ Pending Submissions: ${pendingCount.rows[0].count}`);
        console.log('\n✅ Analytics dummy data inserted successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error inserting dummy data:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Run the script
insertAnalyticsDummyData()
    .then(() => {
        console.log('✅ Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Fatal error:', err);
        process.exit(1);
    });
