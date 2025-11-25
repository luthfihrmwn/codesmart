const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-ap-southeast-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.hbarocftztoyfjeymtah',
  password: 'SMei+q+$9b9!6uH',
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    console.log('Testing connection...');
    const result = await pool.query('SELECT COUNT(*) as count, role FROM users GROUP BY role');
    console.log('✅ SUCCESS! Users by role:');
    result.rows.forEach(r => console.log(`  ${r.role}: ${r.count}`));
    await pool.end();
  } catch (error) {
    console.log('❌ FAILED:', error.message);
    await pool.end();
  }
})();
