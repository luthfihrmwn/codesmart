const { pool } = require('../config/database');

async function checkAssessors() {
    try {
        const result = await pool.query(`
            SELECT id, username, name, email, role, photo_url
            FROM users
            WHERE role = 'assessor'
            ORDER BY id
        `);

        console.log('\n👨‍🏫 Assessors in database:');
        console.table(result.rows);

        console.log(`\nTotal assessors: ${result.rows.length}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAssessors();
