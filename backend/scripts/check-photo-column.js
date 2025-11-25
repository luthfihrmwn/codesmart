const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

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
        console.log('🔍 Checking users table for photo_url column...\n');

        // Check existing columns
        const checkColumns = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN ('photo_url', 'bio', 'address', 'name', 'email')
            ORDER BY column_name;
        `);

        console.log('✅ Relevant columns in users table:');
        checkColumns.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
        });

        // Check if photo_url exists
        const hasPhotoUrl = checkColumns.rows.some(r => r.column_name === 'photo_url');

        if (hasPhotoUrl) {
            console.log('\n✅ photo_url column exists! Photo uploads will be saved to database.');
        } else {
            console.log('\n⚠️  photo_url column NOT found!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkPhotoColumn();
