const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'codesmart_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    // SSL for Supabase and cloud databases
    ssl: process.env.DB_HOST && (process.env.DB_HOST.includes('supabase') || process.env.DB_HOST.includes('pooler'))
        ? { rejectUnauthorized: false }
        : false,
});

async function runMigrations() {
    try {
        console.log('🚀 Starting database migration...\n');

        // Read schema file
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('📖 Reading schema.sql...');

        // Execute schema
        await pool.query(schema);

        console.log('✅ Database schema created successfully!\n');

        // Create default admin user
        console.log('👤 Creating default admin user...');

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD || 'admin123',
            salt
        );

        await pool.query(`
            INSERT INTO users (username, email, password, name, role, status)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) DO NOTHING
        `, [
            process.env.ADMIN_USERNAME || 'admin',
            process.env.ADMIN_EMAIL || 'admin@codesmart.com',
            hashedPassword,
            process.env.ADMIN_NAME || 'Administrator',
            'admin',
            'active'
        ]);

        console.log('✅ Admin user created!\n');

        console.log('🎉 Migration completed successfully!');
        console.log('\n📝 Default Admin Credentials:');
        console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}\n`);

        process.exit(0);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

runMigrations();
