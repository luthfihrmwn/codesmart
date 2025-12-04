const { pool } = require('../config/database');

async function checkUserHasan() {
    try {
        console.log('🔍 Searching for user hasan...\n');

        // Search for user hasan
        const result = await pool.query(`
            SELECT id, username, name, email, role
            FROM users
            WHERE username ILIKE '%hasan%' OR name ILIKE '%hasan%'
            ORDER BY id
        `);

        if (result.rows.length === 0) {
            console.log('❌ No user named hasan found');
            console.log('\n📋 All users in database:');
            const allUsers = await pool.query(`
                SELECT id, username, name, email, role
                FROM users
                WHERE role = 'user'
                ORDER BY id
            `);
            console.table(allUsers.rows);
        } else {
            console.log('✅ Found users matching "hasan":');
            console.table(result.rows);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

checkUserHasan();
