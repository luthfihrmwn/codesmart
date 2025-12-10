const { query } = require('../config/database');
const { spawn } = require('child_process');
const path = require('path');

/**
 * ML Controller - Handle SVM Predictions
 */

// Path to Python script
const PYTHON_SCRIPT = path.join(__dirname, '../ml/scripts/svm_predictor.py');
const VENV_PYTHON = path.join(__dirname, '../venv/bin/python3');
const fs = require('fs');

// Check if venv Python exists, otherwise use system python3
const PYTHON_EXEC = fs.existsSync(VENV_PYTHON) ? VENV_PYTHON : 'python3';

/**
 * Call Python SVM predictor
 */
function callPythonSVM(command, args = []) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(PYTHON_EXEC, [PYTHON_SCRIPT, command, ...args]);

        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(stderr || 'Python process failed'));
                return;
            }

            try {
                const result = JSON.parse(stdout);
                resolve(result);
            } catch (error) {
                reject(new Error('Failed to parse Python output: ' + stdout));
            }
        });
    });
}

/**
 * Initialize SVM model
 * POST /api/v1/ml/init
 */
exports.initializeModel = async (req, res, next) => {
    try {
        const result = await callPythonSVM('init');

        res.json(result);
    } catch (error) {
        console.error('Error initializing model:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize model',
            error: error.message
        });
    }
};

/**
 * Predict level using SVM
 * POST /api/v1/ml/predict
 * Body: { score, correct_answers, time_spent }
 */
exports.predictLevel = async (req, res, next) => {
    try {
        const { score, correct_answers, time_spent } = req.body;

        if (score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Score is required'
            });
        }

        // Prepare features
        const features = {
            score: parseInt(score),
            correct_answers: parseInt(correct_answers || Math.round(score / 5)), // estimate if not provided
            time_spent: parseInt(time_spent || 30) // default 30 minutes
        };

        // Call Python SVM
        const result = await callPythonSVM('predict', [JSON.stringify(features)]);

        res.json(result);
    } catch (error) {
        console.error('Error predicting level:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to predict level',
            error: error.message
        });
    }
};

/**
 * Get current user's prediction
 * GET /api/v1/ml/my-prediction
 */
exports.getMyPrediction = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Get user's prediction data
        const result = await query(
            `SELECT id, name, email, pretest_score, current_level,
                    svm_predicted_level, svm_confidence, svm_probabilities,
                    prediction_date
             FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // If no prediction yet, check if pretest is completed
        if (!user.svm_predicted_level) {
            if (!user.pretest_score) {
                return res.status(400).json({
                    success: false,
                    message: 'Please complete pretest first',
                    has_pretest: false
                });
            }

            return res.status(404).json({
                success: false,
                message: 'No prediction available yet. Generating prediction...',
                has_pretest: true,
                can_predict: true
            });
        }

        res.json({
            success: true,
            data: {
                user_id: user.id,
                name: user.name,
                email: user.email,
                pretest_score: user.pretest_score,
                current_level: user.current_level,
                svm_predicted_level: user.svm_predicted_level,
                svm_confidence: user.svm_confidence,
                svm_probabilities: user.svm_probabilities,
                prediction_date: user.prediction_date
            }
        });
    } catch (error) {
        console.error('Error getting my prediction:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get prediction',
            error: error.message
        });
    }
};

/**
 * Predict level for a specific user
 * POST /api/v1/ml/predict-user/:userId
 */
exports.predictUserLevel = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // Check access: Student can only predict for themselves, admin/assessor can predict for anyone
        if (req.user.role === 'student' && parseInt(userId) !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You can only predict your own level'
            });
        }

        // Get user's pretest data
        const result = await query(
            `SELECT pretest_score, pretest_answers, pretest_time_spent
             FROM users WHERE id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        if (user.pretest_score === null) {
            return res.status(400).json({
                success: false,
                message: 'User has not completed pretest'
            });
        }

        // Count correct answers from pretest_answers (assuming JSON array)
        let correct_answers = 0;
        if (user.pretest_answers) {
            try {
                const answers = JSON.parse(user.pretest_answers);
                correct_answers = answers.filter(a => a.correct).length;
            } catch (e) {
                correct_answers = Math.round(user.pretest_score / 5);
            }
        } else {
            correct_answers = Math.round(user.pretest_score / 5);
        }

        const features = {
            score: user.pretest_score,
            correct_answers: correct_answers,
            time_spent: user.pretest_time_spent || 30
        };

        // Predict
        const prediction = await callPythonSVM('predict', [JSON.stringify(features)]);

        // Save prediction to database
        if (prediction.success) {
            await query(
                `UPDATE users
                 SET svm_predicted_level = $1,
                     svm_confidence = $2,
                     svm_probabilities = $3,
                     prediction_date = NOW()
                 WHERE id = $4`,
                [
                    prediction.predicted_level,
                    prediction.confidence,
                    JSON.stringify(prediction.probabilities),
                    userId
                ]
            );
        }

        res.json({
            success: true,
            data: {
                user_id: userId,
                ...prediction
            }
        });
    } catch (error) {
        console.error('Error predicting user level:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to predict user level',
            error: error.message
        });
    }
};

/**
 * Batch predict for all users with pretest
 * POST /api/v1/ml/batch-predict
 */
exports.batchPredict = async (req, res, next) => {
    try {
        // Get all users with pretest scores
        const result = await query(
            `SELECT id, pretest_score, pretest_answers, pretest_time_spent
             FROM users
             WHERE pretest_score IS NOT NULL`
        );

        const predictions = [];
        const errors = [];

        for (const user of result.rows) {
            try {
                // Count correct answers
                let correct_answers = Math.round(user.pretest_score / 5);
                if (user.pretest_answers) {
                    try {
                        const answers = JSON.parse(user.pretest_answers);
                        correct_answers = answers.filter(a => a.correct).length;
                    } catch (e) {
                        // Use estimation
                    }
                }

                const features = {
                    score: user.pretest_score,
                    correct_answers: correct_answers,
                    time_spent: user.pretest_time_spent || 30
                };

                // Predict
                const prediction = await callPythonSVM('predict', [JSON.stringify(features)]);

                if (prediction.success) {
                    // Save to database
                    await query(
                        `UPDATE users
                         SET svm_predicted_level = $1,
                             svm_confidence = $2,
                             svm_probabilities = $3,
                             prediction_date = NOW()
                         WHERE id = $4`,
                        [
                            prediction.predicted_level,
                            prediction.confidence,
                            JSON.stringify(prediction.probabilities),
                            user.id
                        ]
                    );

                    predictions.push({
                        user_id: user.id,
                        predicted_level: prediction.predicted_level,
                        confidence: prediction.confidence
                    });
                }
            } catch (error) {
                errors.push({
                    user_id: user.id,
                    error: error.message
                });
            }
        }

        res.json({
            success: true,
            data: {
                total_users: result.rows.length,
                successful_predictions: predictions.length,
                failed_predictions: errors.length,
                predictions: predictions,
                errors: errors
            }
        });
    } catch (error) {
        console.error('Error in batch predict:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to perform batch prediction',
            error: error.message
        });
    }
};

/**
 * Get SVM statistics
 * GET /api/v1/ml/stats
 */
exports.getStats = async (req, res, next) => {
    try {
        // Get prediction statistics
        const stats = await query(`
            SELECT
                COUNT(*) as total_predictions,
                COUNT(CASE WHEN svm_predicted_level = 'fundamental' THEN 1 END) as fundamental_count,
                COUNT(CASE WHEN svm_predicted_level = 'intermediate' THEN 1 END) as intermediate_count,
                COUNT(CASE WHEN svm_predicted_level = 'advance' THEN 1 END) as advance_count,
                AVG(svm_confidence) as avg_confidence,
                COUNT(CASE WHEN svm_predicted_level = current_level THEN 1 END) as matching_predictions,
                COUNT(CASE WHEN svm_predicted_level != current_level THEN 1 END) as different_predictions
            FROM users
            WHERE svm_predicted_level IS NOT NULL
        `);

        // Get recent predictions
        const recent = await query(`
            SELECT id, name, email, pretest_score, current_level,
                   svm_predicted_level, svm_confidence, svm_probabilities,
                   prediction_date
            FROM users
            WHERE svm_predicted_level IS NOT NULL
            ORDER BY prediction_date DESC
            LIMIT 50
        `);

        // Format predictions data for frontend
        const predictions = recent.rows.map(user => ({
            id: user.id,
            name: user.name || user.email || 'Unknown',  // Changed from full_name to name
            email: user.email,
            pretest_score: user.pretest_score || 0,
            current_level: user.current_level,
            svm_predicted_level: user.svm_predicted_level,
            svm_confidence: user.svm_confidence || 0,
            svm_probabilities: user.svm_probabilities,
            prediction_date: user.prediction_date
        }));

        res.json({
            success: true,
            data: {
                statistics: {
                    total_predictions: parseInt(stats.rows[0].total_predictions) || 0,
                    fundamental_count: parseInt(stats.rows[0].fundamental_count) || 0,
                    intermediate_count: parseInt(stats.rows[0].intermediate_count) || 0,
                    advance_count: parseInt(stats.rows[0].advance_count) || 0,
                    avg_confidence: parseFloat(stats.rows[0].avg_confidence) || 0,
                    matching_predictions: parseInt(stats.rows[0].matching_predictions) || 0,
                    different_predictions: parseInt(stats.rows[0].different_predictions) || 0
                },
                predictions: predictions
            }
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
};

/**
 * Get model info
 * GET /api/v1/ml/info
 */
exports.getModelInfo = async (req, res, next) => {
    try {
        const result = await callPythonSVM('info');
        res.json(result);
    } catch (error) {
        console.error('Error getting model info:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get model info',
            error: error.message
        });
    }
};
