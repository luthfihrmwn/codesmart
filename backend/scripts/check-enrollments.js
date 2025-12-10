const { query } = require('../config/database');

async function checkEnrollments() {
    try {
        console.log('📊 Checking enrollments table...\n');

        // Count enrollments
        const countResult = await query('SELECT COUNT(*) as count FROM enrollments');
        console.log(`Total enrollments: ${countResult.rows[0].count}`);

        // Get sample enrollments
        const enrollmentsResult = await query(`
            SELECT e.*, u.username, m.name as module_name
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            JOIN modules m ON e.module_id = m.id
            LIMIT 10
        `);

        if (enrollmentsResult.rows.length > 0) {
            console.log('\n📋 Sample enrollments:');
            enrollmentsResult.rows.forEach(e => {
                console.log(`  - ${e.username} enrolled in ${e.module_name} (status: ${e.status})`);
            });
        } else {
            console.log('\n⚠️  No enrollments found!');
        }

        // Check students
        const studentsResult = await query(`SELECT id, username, role FROM users WHERE role = 'student'`);
        console.log(`\n👥 Students in database: ${studentsResult.rows.length}`);
        studentsResult.rows.forEach(s => {
            console.log(`  - ${s.username} (ID: ${s.id})`);
        });

        // Check modules
        const modulesResult = await query(`SELECT id, name, level FROM modules WHERE is_active = true`);
        console.log(`\n📚 Active modules: ${modulesResult.rows.length}`);
        modulesResult.rows.forEach(m => {
            console.log(`  - ${m.name} (${m.level}) - ID: ${m.id}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkEnrollments();
