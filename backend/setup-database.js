#!/usr/bin/env node

const { Pool } = require('pg');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function testConnection(password) {
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: password,
    });

    try {
        await pool.query('SELECT 1');
        await pool.end();
        return true;
    } catch (error) {
        await pool.end();
        return false;
    }
}

async function createDatabase(password) {
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: password,
    });

    try {
        // Check if database exists
        const result = await pool.query(
            "SELECT 1 FROM pg_database WHERE datname = 'codesmart_db'"
        );

        if (result.rows.length === 0) {
            console.log('\n📦 Creating database codesmart_db...');
            await pool.query('CREATE DATABASE codesmart_db');
            console.log('✅ Database created successfully!');
        } else {
            console.log('\n✅ Database codesmart_db already exists!');
        }

        await pool.end();
        return true;
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        await pool.end();
        return false;
    }
}

async function updateEnvFile(password) {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update DB_PASSWORD
    envContent = envContent.replace(
        /DB_PASSWORD=.*/,
        `DB_PASSWORD=${password}`
    );

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated with new password!');
}

async function main() {
    console.log('\n🔧 CodeSmart Database Setup\n');
    console.log('This script will help you configure PostgreSQL for CodeSmart.\n');

    // Step 1: Get password
    console.log('Step 1: PostgreSQL Password');
    console.log('────────────────────────────');

    const password = await question('Enter PostgreSQL postgres user password: ');

    console.log('\n🔄 Testing connection...');

    const connected = await testConnection(password);

    if (!connected) {
        console.log('\n❌ Could not connect to PostgreSQL with that password.\n');
        console.log('Please ensure:');
        console.log('1. PostgreSQL is running (check: sudo systemctl status postgresql)');
        console.log('2. The password is correct');
        console.log('3. PostgreSQL is listening on port 5432\n');

        console.log('To reset PostgreSQL password, run:');
        console.log('  sudo -u postgres psql');
        console.log('  ALTER USER postgres WITH PASSWORD \'your_password\';');
        console.log('  \\q\n');

        rl.close();
        process.exit(1);
    }

    console.log('✅ Connection successful!\n');

    // Step 2: Create database
    console.log('Step 2: Database Creation');
    console.log('─────────────────────────');

    const dbCreated = await createDatabase(password);

    if (!dbCreated) {
        console.log('\n❌ Could not create database. Please check permissions.');
        rl.close();
        process.exit(1);
    }

    // Step 3: Update .env
    console.log('\nStep 3: Update Configuration');
    console.log('────────────────────────────');

    await updateEnvFile(password);

    // Step 4: Run migration
    console.log('\nStep 4: Run Migration');
    console.log('─────────────────────');
    console.log('\nNow run the migration to create tables and admin user:');
    console.log('  npm run migrate\n');

    console.log('🎉 Setup complete! After running migration, you can login with:');
    console.log('   Username: admin');
    console.log('   Password: admin123\n');

    rl.close();
}

main().catch(error => {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
});
