const { query } = require('../config/database');

async function createEnrollments() {
    try {
        console.log('📝 Creating enrollments based on student levels...\n');

        // Get students with their levels
        const studentsResult = await query(`
            SELECT id, username, current_level, pretest_score
            FROM users
            WHERE role = 'student'
            ORDER BY id
        `);

        const students = studentsResult.rows;
        console.log(`Found ${students.length} students:`);
        students.forEach(s => {
            console.log(`  - ${s.username}: level=${s.current_level || 'not set'}, pretest=${s.pretest_score || 'not taken'}`);
        });

        // Get modules
        const modulesResult = await query(`
            SELECT id, name, level
            FROM modules
            WHERE is_active = true
            ORDER BY
                CASE level
                    WHEN 'fundamental' THEN 1
                    WHEN 'intermediate' THEN 2
                    WHEN 'advance' THEN 3
                END
        `);

        const modules = modulesResult.rows;
        console.log(`\nFound ${modules.length} modules:`);
        modules.forEach(m => {
            console.log(`  - ${m.name} (${m.level})`);
        });

        console.log('\n📊 Creating enrollments...\n');

        let enrollmentsCreated = 0;

        for (const student of students) {
            // Determine which modules to enroll based on student level
            let modulesToEnroll = [];

            if (student.current_level === 'advance') {
                // Advance students: enroll in all modules
                modulesToEnroll = modules;
            } else if (student.current_level === 'intermediate') {
                // Intermediate students: enroll in fundamental and intermediate
                modulesToEnroll = modules.filter(m => m.level !== 'advance');
            } else {
                // Fundamental or no level: enroll in fundamental only
                // But if they haven't taken pretest, enroll in all modules
                if (!student.pretest_score) {
                    modulesToEnroll = modules; // No restriction if no pretest
                } else {
                    modulesToEnroll = modules.filter(m => m.level === 'fundamental');
                }
            }

            for (const module of modulesToEnroll) {
                try {
                    await query(`
                        INSERT INTO enrollments (user_id, module_id, status, enrolled_at)
                        VALUES ($1, $2, $3, NOW())
                        ON CONFLICT (user_id, module_id) DO NOTHING
                    `, [student.id, module.id, 'active']);

                    console.log(`✅ ${student.username} enrolled in ${module.name}`);
                    enrollmentsCreated++;
                } catch (error) {
                    console.log(`⚠️  ${student.username} already enrolled in ${module.name}`);
                }
            }
        }

        console.log(`\n✅ Created ${enrollmentsCreated} enrollments!`);

        // Verify enrollments
        const verifyResult = await query(`
            SELECT
                u.username,
                m.name as module_name,
                m.level,
                e.status,
                e.enrolled_at
            FROM enrollments e
            JOIN users u ON e.user_id = u.id
            JOIN modules m ON e.module_id = m.id
            ORDER BY u.username,
                CASE m.level
                    WHEN 'fundamental' THEN 1
                    WHEN 'intermediate' THEN 2
                    WHEN 'advance' THEN 3
                END
        `);

        console.log('\n📋 Final enrollments:');
        verifyResult.rows.forEach(e => {
            console.log(`  - ${e.username} → ${e.module_name} (${e.level}) - ${e.status}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createEnrollments();
