const { Pool } = require('pg');

const passwords = ['', 'postgres', 'postgres123', 'password', 'admin', 'root', '123456'];

async function testConnection(password) {
    const pool = new Pool({
        host: 'localhost',
        port: 5432,
        database: 'postgres',  // Connect to default postgres database first
        user: 'postgres',
        password: password,
    });

    try {
        const result = await pool.query('SELECT version()');
        console.log(`✅ SUCCESS with password: "${password}"`);
        console.log(`PostgreSQL version: ${result.rows[0].version.substring(0, 50)}...`);
        await pool.end();
        return true;
    } catch (error) {
        console.log(`❌ FAILED with password: "${password}" - ${error.message}`);
        await pool.end();
        return false;
    }
}

async function main() {
    console.log('Testing PostgreSQL connection with different passwords...\n');

    for (const password of passwords) {
        const success = await testConnection(password);
        if (success) {
            console.log(`\n🎉 Found working password: "${password}"`);
            console.log(`\nUpdate your .env file:`);
            console.log(`DB_PASSWORD=${password}`);
            process.exit(0);
        }
    }

    console.log('\n❌ No working password found. Please check your PostgreSQL configuration.');
    process.exit(1);
}

main();
