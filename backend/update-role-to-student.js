// Script to update role from 'user' to 'student'
const { Pool } = require('pg');
require('dotenv').config({ path: '/home/luthfi/codesmart/backend/.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function updateRole() {
  try {
    console.log('Starting role update...');

    // Step 1: Drop constraint
    console.log('Step 1: Dropping role constraint...');
    await pool.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');

    // Step 2: Update existing users
    console.log('Step 2: Updating existing user roles...');
    const updateResult = await pool.query(
      "UPDATE users SET role = 'student' WHERE role = 'user' RETURNING id, name, email, role"
    );

    console.log(`Updated ${updateResult.rowCount} users:`);
    updateResult.rows.forEach(row => {
      console.log(`  - ID ${row.id}: ${row.name} (${row.email}) -> role: ${row.role}`);
    });

    // Step 3: Add new constraint
    console.log('Step 3: Adding new role constraint...');
    await pool.query(
      "ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'assessor', 'student'))"
    );

    // Step 4: Verify
    console.log('Step 4: Verifying changes...');
    const verifyResult = await pool.query(
      "SELECT id, name, email, role FROM users WHERE role = 'student'"
    );

    console.log(`\n✅ Success! Total students: ${verifyResult.rowCount}`);
    verifyResult.rows.forEach(row => {
      console.log(`  - ${row.name} (${row.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

updateRole();
