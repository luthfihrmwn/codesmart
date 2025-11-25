// Verify azzahra's replies in each discussion
const { Pool } = require('pg');
require('dotenv').config();

const poolConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD || ''),
  ssl: { rejectUnauthorized: false }
};

const pool = new Pool(poolConfig);

async function verifyAzzahraReplies() {
  try {
    console.log('🔍 Verifying azzahra replies in discussions...\n');

    // Get discussions with reply details
    const result = await pool.query(`
      SELECT
        d.id,
        d.title,
        u.name as author_name,
        (SELECT COUNT(*) FROM discussion_replies WHERE discussion_id = d.id) as total_replies,
        (SELECT COUNT(*) FROM discussion_replies WHERE discussion_id = d.id AND user_id = 6) as azzahra_replies,
        (SELECT u2.name FROM discussion_replies dr2
         JOIN users u2 ON dr2.user_id = u2.id
         WHERE dr2.discussion_id = d.id
         GROUP BY u2.name, u2.id
         ORDER BY COUNT(*) DESC
         LIMIT 1) as most_active_replier
      FROM discussions d
      JOIN users u ON d.user_id = u.id
      ORDER BY total_replies DESC
    `);

    console.log('📊 Discussion Reply Summary:\n');
    result.rows.forEach((row, i) => {
      const percentage = row.total_replies > 0
        ? ((row.azzahra_replies / row.total_replies) * 100).toFixed(1)
        : 0;

      console.log(`${i + 1}. ${row.title}`);
      console.log(`   📝 By: ${row.author_name}`);
      console.log(`   💬 Total replies: ${row.total_replies}`);
      console.log(`   👩‍🏫 Azzahra (assessor): ${row.azzahra_replies} (${percentage}%)`);
      console.log(`   🏆 Most active: ${row.most_active_replier}`);
      console.log('');
    });

    // Get sample of azzahra's replies
    console.log('📝 Sample Azzahra Replies:\n');
    const samples = await pool.query(`
      SELECT
        d.title,
        dr.content,
        dr.created_at
      FROM discussion_replies dr
      JOIN discussions d ON dr.discussion_id = d.id
      JOIN users u ON dr.user_id = u.id
      WHERE u.name = 'azzahra'
      ORDER BY dr.created_at
      LIMIT 5
    `);

    samples.rows.forEach((reply, i) => {
      console.log(`${i + 1}. Discussion: ${reply.title}`);
      console.log(`   Reply: ${reply.content.substring(0, 100)}...`);
      console.log(`   Time: ${new Date(reply.created_at).toLocaleString()}`);
      console.log('');
    });

    // Overall statistics
    const stats = await pool.query(`
      SELECT
        COUNT(DISTINCT dr.discussion_id) as discussions_replied,
        COUNT(dr.id) as total_replies
      FROM discussion_replies dr
      JOIN users u ON dr.user_id = u.id
      WHERE u.name = 'azzahra'
    `);

    console.log('✅ Azzahra (Assessor) Overall Stats:');
    console.log(`   Discussions replied: ${stats.rows[0].discussions_replied}/10`);
    console.log(`   Total replies: ${stats.rows[0].total_replies}`);
    console.log(`   Role: Assessor (helping students understand JavaScript concepts)`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

verifyAzzahraReplies();
