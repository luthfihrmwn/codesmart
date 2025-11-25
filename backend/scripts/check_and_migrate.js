const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function checkAndMigrate() {
    try {
        console.log('🔍 Checking users table columns...');

        // Check existing columns
        const checkColumns = await pool.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN ('bio', 'address', 'phone', 'name', 'email')
            ORDER BY column_name;
        `);

        console.log('\n✅ Current columns:');
        checkColumns.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type}`);
        });

        // Check if bio and address exist
        const hasBio = checkColumns.rows.some(r => r.column_name === 'bio');
        const hasAddress = checkColumns.rows.some(r => r.column_name === 'address');

        if (!hasBio || !hasAddress) {
            console.log('\n⚠️  Missing columns detected. Running migration...');

            // Run migration
            await pool.query(`
                ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
                ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;
            `);

            console.log('✅ Migration completed!');

            // Verify again
            const verifyColumns = await pool.query(`
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_name = 'users'
                AND column_name IN ('bio', 'address', 'phone')
                ORDER BY column_name;
            `);

            console.log('\n✅ Updated columns:');
            verifyColumns.rows.forEach(row => {
                console.log(`   - ${row.column_name}: ${row.data_type}`);
            });
        } else {
            console.log('\n✅ All required columns exist!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkAndMigrate();
