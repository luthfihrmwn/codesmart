const { Pool } = require('pg');

// Test dengan connection string yang berbeda
const configs = [
  {
    name: 'With URL encoding',
    connectionString: 'postgresql://postgres.hbarocftztoyfjeymtah:SMei%2Bq%2B%249b9%216uH@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres'
  },
  {
    name: 'Direct config',
    host: 'aws-1-ap-southeast-2.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.hbarocftztoyfjeymtah',
    password: 'SMei+q+$9b9!6uH'
  }
];

async function testConnection(config) {
  console.log(`\n=== Testing: ${config.name} ===`);
  const pool = new Pool(config);
  
  try {
    const result = await pool.query('SELECT COUNT(*) FROM users');
    console.log('✅ SUCCESS! User count:', result.rows[0].count);
    await pool.end();
    return true;
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    await pool.end();
    return false;
  }
}

(async () => {
  for (const config of configs) {
    await testConnection(config);
  }
})();
