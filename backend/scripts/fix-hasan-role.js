const { query } = require('../config/database');

async function fixRole() {
    try {
        // Update hasan back to student
        await query('UPDATE users SET role = $1 WHERE username = $2', ['student', 'hasan']);
        console.log('✅ Updated hasan back to student');

        // Verify
        const result = await query('SELECT id, username, role FROM users WHERE username = $1', ['hasan']);
        console.log('Verified:', result.rows[0]);

        // Show all users with their roles
        const allUsers = await query('SELECT id, username, role FROM users ORDER BY id');
        console.log('\n📋 All users:');
        allUsers.rows.forEach(u => {
            console.log(`  - ${u.username}: ${u.role} (ID: ${u.id})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

fixRole();
