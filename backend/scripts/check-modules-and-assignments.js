const { pool } = require('../config/database');

async function checkData() {
    try {
        console.log('Checking modules and assignments...\n');

        // Check modules
        const modulesResult = await pool.query('SELECT id, name, slug, level FROM modules ORDER BY id');
        console.log(`\n📚 Found ${modulesResult.rows.length} modules:`);
        console.table(modulesResult.rows);

        // Check classes
        const classesResult = await pool.query('SELECT id, code, name, level FROM classes ORDER BY id');
        console.log(`\n🏫 Found ${classesResult.rows.length} classes:`);
        console.table(classesResult.rows);

        // Check assignments
        const assignmentsResult = await pool.query(`
            SELECT
                id, title, module_id, class_number, max_score, is_active
            FROM assignments
            ORDER BY id
        `);
        console.log(`\n📝 Found ${assignmentsResult.rows.length} assignments:`);
        console.table(assignmentsResult.rows);

        // Check assignments with module relationship
        const assignmentsWithModuleResult = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.module_id,
                a.class_number,
                m.name as module_name,
                m.level as module_level,
                c.code as class_code,
                c.level as class_level
            FROM assignments a
            LEFT JOIN modules m ON a.module_id = m.id
            LEFT JOIN classes c ON a.class_number = c.id
            ORDER BY a.id
        `);
        console.log(`\n🔗 Assignments with relationships:`);
        console.table(assignmentsWithModuleResult.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

checkData();
