const { pool } = require('../config/database');

async function deleteLuthfiSubmissions() {
    try {
        console.log('🔍 Searching for user luthfi...\n');

        // Find user luthfi
        const userResult = await pool.query(`
            SELECT id, username, name, email, role
            FROM users
            WHERE username ILIKE '%luthfi%' OR name ILIKE '%luthfi%'
        `);

        if (userResult.rows.length === 0) {
            console.log('❌ User luthfi not found');
            process.exit(0);
        }

        console.log('✅ Found users:');
        console.table(userResult.rows);

        for (const user of userResult.rows) {
            console.log(`\n🗑️  Deleting submissions for: ${user.name} (ID: ${user.id})`);

            // Check submissions first
            const checkResult = await pool.query(`
                SELECT
                    s.id,
                    s.status,
                    a.title as assignment_title
                FROM submissions s
                JOIN assignments a ON s.assignment_id = a.id
                WHERE s.user_id = $1
                ORDER BY s.id
            `, [user.id]);

            console.log(`   Found ${checkResult.rows.length} submissions`);

            if (checkResult.rows.length > 0) {
                console.table(checkResult.rows);

                // Delete submissions
                const deleteResult = await pool.query(`
                    DELETE FROM submissions
                    WHERE user_id = $1
                    RETURNING id
                `, [user.id]);

                console.log(`   ✅ Deleted ${deleteResult.rows.length} submissions`);
            } else {
                console.log('   No submissions to delete');
            }
        }

        // Show final count
        const finalCount = await pool.query(`
            SELECT COUNT(*) as total FROM submissions
        `);

        console.log(`\n📊 Total submissions remaining in database: ${finalCount.rows[0].total}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

deleteLuthfiSubmissions();
