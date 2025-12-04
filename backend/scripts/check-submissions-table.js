const { pool } = require('../config/database');

async function checkTable() {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'submissions'
            ORDER BY ordinal_position
        `);

        console.log('\n📋 Submissions Table Structure:');
        console.table(result.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkTable();
