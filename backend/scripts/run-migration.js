const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration(migrationFile) {
    const client = await pool.connect();
    try {
        const migrationPath = path.join(__dirname, '..', 'migrations', migrationFile);
        const sql = fs.readFileSync(migrationPath, 'utf8');

        console.log(`\n🚀 Running migration: ${migrationFile}`);
        console.log('='.repeat(50));

        await client.query(sql);

        console.log('✅ Migration completed successfully!');
        console.log('='.repeat(50));
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Get migration file from command line argument
const migrationFile = process.argv[2] || '008_create_notifications.sql';

runMigration(migrationFile)
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
