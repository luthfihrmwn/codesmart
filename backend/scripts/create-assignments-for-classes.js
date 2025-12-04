const { pool } = require('../config/database');

async function createAssignments() {
    try {
        console.log('Creating assignments for each class...\n');

        // Get all classes
        const classesResult = await pool.query('SELECT * FROM classes ORDER BY id');
        const classes = classesResult.rows;

        console.log(`Found ${classes.length} classes\n`);

        // Get admin user (created_by)
        const adminResult = await pool.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1");
        const adminId = adminResult.rows[0]?.id || 1;

        const assignments = [];

        for (const cls of classes) {
            const assignmentTitle = `${cls.code} - Final Project`;
            const description = `Final project assignment for ${cls.name} class. Submit your complete project with documentation.`;

            const requirements = {
                items: [
                    'Complete source code',
                    'README documentation',
                    'Test cases',
                    'Deployment guide'
                ]
            };

            const rubric = {
                criteria: [
                    { name: 'Code Quality', points: 30, description: 'Clean, well-structured code' },
                    { name: 'Functionality', points: 30, description: 'All features working correctly' },
                    { name: 'Documentation', points: 20, description: 'Clear and comprehensive docs' },
                    { name: 'Testing', points: 20, description: 'Adequate test coverage' }
                ]
            };

            // Set due date 30 days from now
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 30);

            const result = await pool.query(`
                INSERT INTO assignments (
                    module_id,
                    class_number,
                    title,
                    description,
                    requirements,
                    rubric,
                    max_score,
                    due_date,
                    is_active,
                    created_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING id, title
            `, [
                null,  // module_id (we're using class_id concept, but table has module_id)
                cls.id, // class_number - we'll use this for class_id
                assignmentTitle,
                description,
                JSON.stringify(requirements),
                JSON.stringify(rubric),
                100,
                dueDate,
                true,
                adminId
            ]);

            assignments.push(result.rows[0]);
            console.log(`✅ Created: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
        }

        console.log(`\n✅ Successfully created ${assignments.length} assignments\n`);

        // Show summary
        const summary = await pool.query(`
            SELECT
                a.id,
                a.title,
                a.class_number as class_id,
                a.max_score,
                a.due_date,
                c.name as class_name,
                c.code as class_code
            FROM assignments a
            LEFT JOIN classes c ON a.class_number = c.id
            WHERE a.class_number IS NOT NULL
            ORDER BY c.code
        `);

        console.log('📊 Assignments Summary:');
        console.table(summary.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        process.exit(1);
    }
}

createAssignments();
