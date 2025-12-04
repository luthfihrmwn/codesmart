const { pool } = require('../config/database');

async function createSubmissionsForHasan() {
    try {
        console.log('🔄 Creating submissions for user hasan...\n');

        // Get user hasan
        const userResult = await pool.query(`
            SELECT id, username, name, email
            FROM users
            WHERE username = 'hasan'
            LIMIT 1
        `);

        if (userResult.rows.length === 0) {
            console.log('❌ User hasan not found');
            process.exit(1);
        }

        const hasan = userResult.rows[0];
        console.log(`✅ Found user: ${hasan.name} (ID: ${hasan.id})`);
        console.log(`   Email: ${hasan.email}\n`);

        // Get all assignments
        const assignmentsResult = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.class_number,
                a.module_id
            FROM assignments a
            WHERE a.is_active = true
            ORDER BY a.class_number, a.title
        `);

        console.log(`📋 Found ${assignmentsResult.rows.length} assignments\n`);

        if (assignmentsResult.rows.length === 0) {
            console.log('❌ No assignments found. Please create assignments first.');
            process.exit(1);
        }

        // Delete existing submissions by hasan
        const deleteResult = await pool.query(`
            DELETE FROM submissions
            WHERE user_id = $1
            RETURNING id
        `, [hasan.id]);

        console.log(`🗑️  Deleted ${deleteResult.rows.length} existing submissions for hasan\n`);

        // Create submissions for each assignment
        let pendingCount = 0;
        let gradedCount = 0;

        for (let i = 0; i < assignmentsResult.rows.length; i++) {
            const assignment = assignmentsResult.rows[i];
            const isGraded = i % 3 === 0; // Every 3rd submission is graded, others are pending

            const fileUrl = `/uploads/submissions/hasan_assignment_${assignment.id}.pdf`;
            const fileName = `${assignment.title.replace(/\s+/g, '_')}_hasan.pdf`;
            const submissionText = `This is my submission for ${assignment.title}. I have completed all requirements and tested the code thoroughly.`;

            if (isGraded) {
                // Create graded submission
                const score = 75 + Math.floor(Math.random() * 25); // Score between 75-100
                const feedback = `Good work on ${assignment.title}. ${score >= 90 ? 'Excellent implementation!' : score >= 80 ? 'Well done, minor improvements needed.' : 'Good effort, but needs some refinement.'}`;

                await pool.query(`
                    INSERT INTO submissions (
                        user_id, assignment_id, file_url, file_name,
                        submission_text, status, score, feedback,
                        submitted_at, graded_at, graded_by
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8,
                            NOW() - INTERVAL '5 days',
                            NOW() - INTERVAL '2 days', 6)
                `, [hasan.id, assignment.id, fileUrl, fileName, submissionText,
                    'graded', score, feedback]);

                console.log(`✅ Created GRADED submission for: ${assignment.title} (Score: ${score})`);
                gradedCount++;
            } else {
                // Create pending submission
                await pool.query(`
                    INSERT INTO submissions (
                        user_id, assignment_id, file_url, file_name,
                        submission_text, status, submitted_at
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '1 day')
                `, [hasan.id, assignment.id, fileUrl, fileName, submissionText, 'pending']);

                console.log(`⏳ Created PENDING submission for: ${assignment.title}`);
                pendingCount++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Total submissions created: ${assignmentsResult.rows.length}`);
        console.log(`   Pending submissions: ${pendingCount}`);
        console.log(`   Graded submissions: ${gradedCount}`);
        console.log(`   Average score: ${gradedCount > 0 ? Math.round((75 + 100) / 2) : 'N/A'}%`);

        // Show final status
        const finalResult = await pool.query(`
            SELECT
                s.id,
                s.status,
                s.score,
                a.title as assignment_title,
                s.submitted_at,
                s.graded_at
            FROM submissions s
            JOIN assignments a ON s.assignment_id = a.id
            WHERE s.user_id = $1
            ORDER BY s.submitted_at DESC
        `, [hasan.id]);

        console.log('\n📋 All submissions for hasan:');
        console.table(finalResult.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createSubmissionsForHasan();
