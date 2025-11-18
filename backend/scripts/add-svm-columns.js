const { query } = require('../config/database');

async function addSVMColumns() {
    try {
        console.log('🔧 Adding SVM columns to users table...');

        // Add SVM-related columns
        await query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS svm_predicted_level VARCHAR(50),
            ADD COLUMN IF NOT EXISTS svm_confidence FLOAT,
            ADD COLUMN IF NOT EXISTS svm_probabilities JSONB,
            ADD COLUMN IF NOT EXISTS prediction_date TIMESTAMP,
            ADD COLUMN IF NOT EXISTS pretest_answers JSONB,
            ADD COLUMN IF NOT EXISTS pretest_time_spent INTEGER;
        `);

        console.log('✅ SVM columns added successfully');

        // Create indexes for better performance
        await query(`
            CREATE INDEX IF NOT EXISTS idx_users_svm_level
            ON users(svm_predicted_level);
        `);

        await query(`
            CREATE INDEX IF NOT EXISTS idx_users_prediction_date
            ON users(prediction_date);
        `);

        console.log('✅ Indexes created successfully');

        // Verify columns exist
        const result = await query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN (
                'svm_predicted_level',
                'svm_confidence',
                'svm_probabilities',
                'prediction_date',
                'pretest_answers',
                'pretest_time_spent'
            )
            ORDER BY column_name;
        `);

        console.log('\n📊 SVM Columns in users table:');
        result.rows.forEach(row => {
            console.log(`   - ${row.column_name}: ${row.data_type}`);
        });

        console.log('\n✅ Database schema updated successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error updating database schema:', error);
        process.exit(1);
    }
}

addSVMColumns();
