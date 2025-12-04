const { pool } = require('../config/database');

async function createClassesTable() {
    try {
        console.log('Creating classes table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                code VARCHAR(50) NOT NULL UNIQUE,
                level VARCHAR(50) NOT NULL CHECK (level IN ('fundamental', 'intermediate', 'advance')),
                description TEXT,
                capacity INTEGER DEFAULT 30,
                student_count INTEGER DEFAULT 0,
                schedule VARCHAR(255),
                assessor_id INTEGER REFERENCES users(id),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('✅ Classes table created successfully');

        // Insert initial data
        console.log('\nInserting class data...');

        const classData = [
            // Fundamental classes
            { name: 'FDM-A1', code: 'FDM-A1', level: 'fundamental', description: 'Fundamental Programming - Class A1' },
            { name: 'FDM-A2', code: 'FDM-A2', level: 'fundamental', description: 'Fundamental Programming - Class A2' },
            { name: 'FDM-A3', code: 'FDM-A3', level: 'fundamental', description: 'Fundamental Programming - Class A3' },
            { name: 'FDM-B1', code: 'FDM-B1', level: 'fundamental', description: 'Fundamental Programming - Class B1' },
            // Intermediate classes
            { name: 'INT-A1', code: 'INT-A1', level: 'intermediate', description: 'Intermediate Programming - Class A1' },
            { name: 'INT-B2', code: 'INT-B2', level: 'intermediate', description: 'Intermediate Programming - Class B2' },
            // Advanced classes
            { name: 'ADV-A1', code: 'ADV-A1', level: 'advance', description: 'Advanced Programming - Class A1' },
            { name: 'ADV-A2', code: 'ADV-A2', level: 'advance', description: 'Advanced Programming - Class A2' },
            { name: 'ADV-B1', code: 'ADV-B1', level: 'advance', description: 'Advanced Programming - Class B1' }
        ];

        for (const cls of classData) {
            await pool.query(`
                INSERT INTO classes (name, code, level, description, capacity, student_count, schedule, is_active)
                VALUES ($1, $2, $3, $4, 30, 0, 'Flexible', true)
                ON CONFLICT (code) DO NOTHING
            `, [cls.name, cls.code, cls.level, cls.description]);

            console.log(`✅ Inserted: ${cls.code} - ${cls.name}`);
        }

        // Verify data
        const result = await pool.query('SELECT id, name, code, level FROM classes ORDER BY level, code');
        console.log('\n📊 Classes in database:');
        console.table(result.rows);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createClassesTable();
