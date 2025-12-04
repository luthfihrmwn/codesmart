const { pool } = require('../config/database');

async function checkTable() {
    try {
        // Check table structure
        const structure = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'assignments'
            ORDER BY ordinal_position;
        `);

        console.log('📋 Assignments Table Structure:');
        console.table(structure.rows);

        // Check existing data
        const data = await pool.query('SELECT * FROM assignments LIMIT 5');
        console.log('\n📊 Sample Data:');
        console.table(data.rows);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkTable();
