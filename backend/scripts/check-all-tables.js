const { pool } = require('../config/database');

async function checkTables() {
    try {
        const tables = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);

        console.log('📋 All Tables in Database:');
        tables.rows.forEach((row, idx) => {
            console.log(`${idx + 1}. ${row.table_name}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

checkTables();
