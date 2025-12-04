const { pool } = require('../config/database');

async function checkAssignmentsStructure() {
    try {
        console.log('🔍 Checking assignments table structure...\n');

        // Get table structure
        const structure = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'assignments'
            ORDER BY ordinal_position
        `);

        console.log('📋 Assignments table columns:');
        console.table(structure.rows);

        // Get sample assignments
        const assignments = await pool.query(`
            SELECT *
            FROM assignments
            LIMIT 5
        `);

        console.log('\n📦 Sample assignments:');
        console.table(assignments.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

checkAssignmentsStructure();
