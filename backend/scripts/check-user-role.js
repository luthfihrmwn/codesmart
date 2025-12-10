const { query } = require('../config/database');

async function checkRole() {
    try {
        const result = await query('SELECT id, username, role FROM users WHERE username = $1', ['hasan']);
        console.log('Hasan role:', result.rows[0]);

        // Update to assessor
        await query('UPDATE users SET role = $1 WHERE username = $2', ['assessor', 'hasan']);
        console.log('✅ Updated hasan to assessor');

        const verify = await query('SELECT id, username, role FROM users WHERE username = $1', ['hasan']);
        console.log('Verified:', verify.rows[0]);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkRole();
