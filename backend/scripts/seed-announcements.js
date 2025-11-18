const { Pool } = require('pg');
require('dotenv').config({ path: '/home/luthfi/codesmart/backend/.env' });

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
});

async function seedAnnouncements() {
    const client = await pool.connect();

    try {
        console.log('🌱 Seeding announcements...\n');

        const announcements = [
            {
                title: 'Welcome to CodeSmart LMS!',
                content: 'We are excited to announce the launch of our new Learning Management System. Explore the features and start your learning journey today!',
                priority: 'high',
                target_role: 'student',
                target_level: 'all',
                author_id: 1
            },
            {
                title: 'Important: Assignment Deadline Extended',
                content: 'Due to technical difficulties, the deadline for Assignment 1 has been extended to next Friday. Please ensure you submit your work on time.',
                priority: 'urgent',
                target_role: 'student',
                target_level: 'beginner',
                author_id: 1
            },
            {
                title: 'New JavaScript Module Available',
                content: 'A new Advanced JavaScript module is now available. This module covers ES6+, async/await, promises, and more. Check it out in the Modules section!',
                priority: 'normal',
                target_role: 'student',
                target_level: 'advanced',
                author_id: 1
            },
            {
                title: 'System Maintenance Notice',
                content: 'The system will undergo scheduled maintenance this weekend from 2 AM to 6 AM. Please plan your work accordingly.',
                priority: 'high',
                target_role: 'all',
                target_level: 'all',
                author_id: 1
            },
            {
                title: 'Tips for Success',
                content: 'Regular practice is key to mastering programming. Try to code every day, even if it is just for 30 minutes. Stay consistent!',
                priority: 'low',
                target_role: 'student',
                target_level: 'all',
                author_id: 1
            }
        ];

        for (const announcement of announcements) {
            const result = await client.query(
                `INSERT INTO announcements (title, content, priority, target_role, target_level, author_id, is_active, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, $6, true, NOW(), NOW())
                 RETURNING id, title`,
                [announcement.title, announcement.content, announcement.priority, announcement.target_role, announcement.target_level, announcement.author_id]
            );

            console.log(`✅ Created: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
        }

        // Verify
        const check = await client.query('SELECT COUNT(*) as count FROM announcements');
        console.log(`\n📊 Total announcements in database: ${check.rows[0].count}`);

        console.log('\n✨ Seeding complete!');

    } catch (error) {
        console.error('❌ Error seeding announcements:', error.message);
        console.error('Details:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seedAnnouncements();
