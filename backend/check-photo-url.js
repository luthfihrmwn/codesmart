const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

async function checkPhotoColumn() {
    try {
        console.log('🔍 Checking for photo_url column...\n');

        const checkColumns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN ('photo_url', 'name', 'email')
            ORDER BY column_name;
        `);

        console.log('✅ Relevant columns:');
        checkColumns.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        const hasPhotoUrl = checkColumns.rows.some(r => r.column_name === 'photo_url');

        if (!hasPhotoUrl) {
            console.log('\n⚠️  photo_url column NOT found! Adding it...');
            await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS photo_url TEXT;`);
            console.log('✅ photo_url column added!');
        } else {
            console.log('\n✅ photo_url column exists!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkPhotoColumn();
