const { pool } = require('../config/database');

async function assignClassesToAssessor() {
    try {
        console.log('🔄 Assigning all classes to assessor...\n');

        // Get assessor (azzahra)
        const assessorResult = await pool.query(`
            SELECT id, username, name, email
            FROM users
            WHERE role = 'assessor'
            LIMIT 1
        `);

        if (assessorResult.rows.length === 0) {
            console.log('❌ No assessor found in database');
            process.exit(1);
        }

        const assessor = assessorResult.rows[0];
        console.log(`✅ Found assessor: ${assessor.name} (${assessor.email})`);
        console.log(`   Assessor ID: ${assessor.id}\n`);

        // Update all classes to assign to this assessor
        const updateResult = await pool.query(`
            UPDATE classes
            SET assessor_id = $1,
                updated_at = NOW()
            WHERE assessor_id IS NULL OR assessor_id != $1
            RETURNING id, name, code, level
        `, [assessor.id]);

        console.log(`✅ Updated ${updateResult.rows.length} classes\n`);

        if (updateResult.rows.length > 0) {
            console.log('📋 Updated classes:');
            console.table(updateResult.rows);
        }

        // Show final status
        const allClassesResult = await pool.query(`
            SELECT
                c.id,
                c.code,
                c.name,
                c.level,
                c.assessor_id,
                u.name as assessor_name,
                u.email as assessor_email
            FROM classes c
            LEFT JOIN users u ON c.assessor_id = u.id
            ORDER BY c.level, c.code
        `);

        console.log('\n📊 All classes status:');
        console.table(allClassesResult.rows);

        // Count summary
        const assignedCount = allClassesResult.rows.filter(c => c.assessor_id !== null).length;
        const unassignedCount = allClassesResult.rows.filter(c => c.assessor_id === null).length;

        console.log('\n✅ Summary:');
        console.log(`   Total classes: ${allClassesResult.rows.length}`);
        console.log(`   Assigned: ${assignedCount}`);
        console.log(`   Unassigned: ${unassignedCount}`);
        console.log(`   Assessor: ${assessor.name} (${assessor.email})`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

assignClassesToAssessor();
