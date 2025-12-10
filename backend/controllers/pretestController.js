const { query, getClient } = require('../config/database');

// @desc    Get shuffled pretest questions for student
// @route   GET /api/v1/pretest/questions
// @access  Private (Student)
exports.getPretestQuestions = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get 30 active questions and shuffle them based on user ID (consistent shuffle per user)
        const result = await query(
            `SELECT
                id,
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                module_category,
                difficulty_level,
                points
             FROM pretest_questions
             WHERE is_active = true
             ORDER BY MD5(CONCAT(id::text, $1::text))
             LIMIT 30`,
            [userId]
        );

        // Don't send correct answers to frontend
        const questions = result.rows.map((q, index) => ({
            questionNumber: index + 1,
            id: q.id,
            question: q.question_text,
            options: {
                A: q.option_a,
                B: q.option_b,
                C: q.option_c,
                D: q.option_d
            },
            category: q.module_category,
            difficulty: q.difficulty_level,
            points: q.points
        }));

        res.json({
            success: true,
            data: {
                questions: questions,
                totalQuestions: questions.length,
                timeLimit: null, // No time limit
                instructions: [
                    'Total pertanyaan: 30 soal',
                    'Durasi: Tidak dibatasi',
                    'Sistem penilaian berdasarkan jawaban benar',
                    'Hasil akan menentukan modul rekomendasi Anda'
                ]
            }
        });

    } catch (error) {
        console.error('Error fetching pretest questions:', error);
        next(error);
    }
};

// @desc    Submit pretest answers
// @route   POST /api/v1/pretest/submit
// @access  Private (Student)
exports.submitPretest = async (req, res, next) => {
    const client = await getClient();

    try {
        const userId = req.user.id;
        const { answers } = req.body; // Array of {questionId, answer}

        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid answers format'
            });
        }

        await client.query('BEGIN');

        // Check if user already has pretest score
        const existingTest = await client.query(
            'SELECT pretest_score FROM users WHERE id = $1',
            [userId]
        );

        if (existingTest.rows[0].pretest_score !== null) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'You have already completed the pretest'
            });
        }

        // Get correct answers from database
        const questionIds = answers.map(a => a.questionId);
        const correctAnswers = await client.query(
            `SELECT id, correct_answer, points, module_category
             FROM pretest_questions
             WHERE id = ANY($1::int[])`,
            [questionIds]
        );

        const answerMap = new Map(correctAnswers.rows.map(q => [q.id, q]));

        // Calculate score
        let totalScore = 0;
        let correctCount = 0;
        const categoryScores = {
            fundamental: { correct: 0, total: 0 },
            intermediate: { correct: 0, total: 0 },
            advance: { correct: 0, total: 0 }
        };

        answers.forEach(answer => {
            const question = answerMap.get(answer.questionId);
            if (question) {
                categoryScores[question.module_category].total++;

                if (answer.answer.toUpperCase() === question.correct_answer) {
                    totalScore += question.points;
                    correctCount++;
                    categoryScores[question.module_category].correct++;
                }
            }
        });

        // Determine recommended level based on score
        let recommendedLevel = 'fundamental';
        const scorePercentage = (totalScore / 30) * 100;

        if (scorePercentage >= 70) {
            recommendedLevel = 'advance';
        } else if (scorePercentage >= 45) {
            recommendedLevel = 'intermediate';
        }

        // Update user's pretest score and level
        await client.query(
            `UPDATE users
             SET pretest_score = $1,
                 current_level = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3`,
            [totalScore, recommendedLevel, userId]
        );

        // Save detailed pretest results (optional - for analytics)
        await client.query(
            `INSERT INTO user_pretest_results
             (user_id, total_score, correct_count, total_questions, recommended_level, category_breakdown, completed_at)
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO NOTHING`,
            [
                userId,
                totalScore,
                correctCount,
                answers.length,
                recommendedLevel,
                JSON.stringify(categoryScores)
            ]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Pretest submitted successfully',
            data: {
                score: totalScore,
                maxScore: 30,
                percentage: scorePercentage.toFixed(2),
                correctAnswers: correctCount,
                totalQuestions: answers.length,
                recommendedLevel: recommendedLevel,
                categoryBreakdown: categoryScores
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error submitting pretest:', error);
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Get pretest results
// @route   GET /api/v1/pretest/results
// @access  Private (Student)
exports.getPretestResults = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await query(
            `SELECT
                u.pretest_score,
                u.current_level,
                upr.correct_count,
                upr.total_questions,
                upr.category_breakdown,
                upr.completed_at
             FROM users u
             LEFT JOIN user_pretest_results upr ON u.id = upr.user_id
             WHERE u.id = $1`,
            [userId]
        );

        if (result.rows.length === 0 || result.rows[0].pretest_score === null) {
            return res.status(404).json({
                success: false,
                message: 'No pretest results found'
            });
        }

        const data = result.rows[0];
        const percentage = (data.pretest_score / 30) * 100;

        res.json({
            success: true,
            data: {
                score: data.pretest_score,
                maxScore: 30,
                percentage: percentage.toFixed(2),
                correctAnswers: data.correct_count,
                totalQuestions: data.total_questions,
                recommendedLevel: data.current_level,
                categoryBreakdown: data.category_breakdown,
                completedAt: data.completed_at
            }
        });

    } catch (error) {
        console.error('Error fetching pretest results:', error);
        next(error);
    }
};

// @desc    Get all pretest questions (Admin only)
// @route   GET /api/v1/admin/pretest/questions
// @access  Admin
exports.getAllPretestQuestions = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT * FROM pretest_questions
             ORDER BY module_category, id`
        );

        res.json({
            success: true,
            data: {
                questions: result.rows,
                total: result.rows.length
            }
        });

    } catch (error) {
        console.error('Error fetching all pretest questions:', error);
        next(error);
    }
};

// @desc    Create pretest question (Admin only)
// @route   POST /api/v1/admin/pretest/questions
// @access  Admin
exports.createPretestQuestion = async (req, res, next) => {
    try {
        const {
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            module_category,
            difficulty_level,
            points,
            explanation
        } = req.body;

        const result = await query(
            `INSERT INTO pretest_questions
             (question_text, option_a, option_b, option_c, option_d, correct_answer,
              module_category, difficulty_level, points, explanation)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING *`,
            [
                question_text,
                option_a,
                option_b,
                option_c,
                option_d,
                correct_answer.toUpperCase(),
                module_category,
                difficulty_level || 'medium',
                points || 1,
                explanation || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Pretest question created successfully',
            data: {
                question: result.rows[0]
            }
        });

    } catch (error) {
        console.error('Error creating pretest question:', error);
        next(error);
    }
};

// @desc    Update pretest question (Admin only)
// @route   PUT /api/v1/admin/pretest/questions/:id
// @access  Admin
exports.updatePretestQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const fieldsToUpdate = {};
        const allowedFields = [
            'question_text', 'option_a', 'option_b', 'option_c', 'option_d',
            'correct_answer', 'module_category', 'difficulty_level', 'points',
            'explanation', 'is_active'
        ];

        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                fieldsToUpdate[field] = updates[field];
            }
        });

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = [...Object.values(fieldsToUpdate), id];

        const result = await query(
            `UPDATE pretest_questions
             SET ${setClause}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $${values.length}
             RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pretest question not found'
            });
        }

        res.json({
            success: true,
            message: 'Pretest question updated successfully',
            data: {
                question: result.rows[0]
            }
        });

    } catch (error) {
        console.error('Error updating pretest question:', error);
        next(error);
    }
};

// @desc    Delete pretest question (Admin only)
// @route   DELETE /api/v1/admin/pretest/questions/:id
// @access  Admin
exports.deletePretestQuestion = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            'DELETE FROM pretest_questions WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Pretest question not found'
            });
        }

        res.json({
            success: true,
            message: 'Pretest question deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting pretest question:', error);
        next(error);
    }
};
