const { query, getClient } = require('../config/database');

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, username, email, name, phone, photo_url, role, status,
                    pretest_score, current_level, created_at
             FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
    try {
        const { name, email, phone, photo_url } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (phone) fieldsToUpdate.phone = phone;
        if (photo_url) fieldsToUpdate.photo_url = photo_url;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = [...Object.values(fieldsToUpdate), req.user.id];

        const result = await query(
            `UPDATE users SET ${setClause} WHERE id = $${values.length}
             RETURNING id, username, email, name, phone, photo_url, role, current_level, pretest_score`,
            values
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Submit pretest
// @route   POST /api/v1/users/pretest/submit
// @access  Private
exports.submitPretest = async (req, res, next) => {
    try {
        const { answers, score } = req.body;

        if (!answers || score === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Answers and score are required'
            });
        }

        // Determine level based on score
        let currentLevel;
        if (score >= 0 && score <= 45) {
            currentLevel = 'fundamental';
        } else if (score >= 46 && score <= 65) {
            currentLevel = 'intermediate';
        } else if (score >= 66 && score <= 100) {
            currentLevel = 'advance';
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid score'
            });
        }

        // Update user with pretest score and level
        const result = await query(
            `UPDATE users
             SET pretest_score = $1, current_level = $2
             WHERE id = $3
             RETURNING id, username, email, name, pretest_score, current_level`,
            [score, currentLevel, req.user.id]
        );

        // Auto-enroll user in their starting module
        const moduleResult = await query(
            `SELECT id FROM modules WHERE level = $1 AND is_active = true LIMIT 1`,
            [currentLevel]
        );

        if (moduleResult.rows.length > 0) {
            await query(
                `INSERT INTO enrollments (user_id, module_id, status)
                 VALUES ($1, $2, 'active')
                 ON CONFLICT (user_id, module_id) DO NOTHING`,
                [req.user.id, moduleResult.rows[0].id]
            );
        }

        res.json({
            success: true,
            message: 'Pretest submitted successfully',
            data: {
                user: result.rows[0],
                level: currentLevel,
                score: score
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get pretest result
// @route   GET /api/v1/users/pretest/result
// @access  Private
exports.getPretestResult = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT pretest_score, current_level FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows[0].pretest_score === null) {
            return res.status(404).json({
                success: false,
                message: 'Pretest not completed yet'
            });
        }

        res.json({
            success: true,
            data: {
                score: result.rows[0].pretest_score,
                level: result.rows[0].current_level
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user enrollments
// @route   GET /api/v1/users/enrollments
// @access  Private
exports.getUserEnrollments = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT e.id, e.status, e.progress, e.enrolled_at, e.completed_at,
                    m.id as module_id, m.name as module_name, m.slug, m.level, m.description
             FROM enrollments e
             JOIN modules m ON e.module_id = m.id
             WHERE e.user_id = $1
             ORDER BY e.enrolled_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                enrollments: result.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Enroll in module
// @route   POST /api/v1/users/enrollments
// @access  Private
exports.enrollInModule = async (req, res, next) => {
    try {
        const { moduleId } = req.body;

        if (!moduleId) {
            return res.status(400).json({
                success: false,
                message: 'Module ID is required'
            });
        }

        // Check if module exists
        const moduleResult = await query(
            `SELECT id, level, is_active FROM modules WHERE id = $1`,
            [moduleId]
        );

        if (moduleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const module = moduleResult.rows[0];

        if (!module.is_active) {
            return res.status(400).json({
                success: false,
                message: 'Module is not active'
            });
        }

        // Check if user has completed pretest
        const userResult = await query(
            `SELECT pretest_score, current_level FROM users WHERE id = $1`,
            [req.user.id]
        );

        if (userResult.rows[0].pretest_score === null) {
            return res.status(403).json({
                success: false,
                message: 'Please complete pretest first'
            });
        }

        // Check if user already enrolled
        const enrollmentCheck = await query(
            `SELECT id FROM enrollments WHERE user_id = $1 AND module_id = $2`,
            [req.user.id, moduleId]
        );

        if (enrollmentCheck.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this module'
            });
        }

        // Enroll user
        const result = await query(
            `INSERT INTO enrollments (user_id, module_id, status)
             VALUES ($1, $2, 'active')
             RETURNING id, user_id, module_id, status, enrolled_at`,
            [req.user.id, moduleId]
        );

        res.json({
            success: true,
            message: 'Enrolled successfully',
            data: {
                enrollment: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user progress
// @route   GET /api/v1/users/progress
// @access  Private
exports.getUserProgress = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT e.id, e.progress, e.status,
                    m.name as module_name, m.slug, m.level,
                    COUNT(DISTINCT lm.id) as total_classes,
                    COUNT(DISTINCT a.id) as total_assignments,
                    COUNT(DISTINCT s.id) as submitted_assignments,
                    COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_assignments
             FROM enrollments e
             JOIN modules m ON e.module_id = m.id
             LEFT JOIN learning_materials lm ON m.id = lm.module_id
             LEFT JOIN assignments a ON m.id = a.module_id
             LEFT JOIN submissions s ON a.id = s.assignment_id AND s.user_id = e.user_id
             WHERE e.user_id = $1
             GROUP BY e.id, m.id
             ORDER BY e.enrolled_at DESC`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                progress: result.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Mark class as complete
// @route   POST /api/v1/users/progress/class/:classId
// @access  Private
exports.markClassComplete = async (req, res, next) => {
    try {
        const { classId } = req.params;

        // Get class and module info
        const classResult = await query(
            `SELECT lm.id, lm.module_id, lm.class_number, m.slug
             FROM learning_materials lm
             JOIN modules m ON lm.module_id = m.id
             WHERE lm.id = $1`,
            [classId]
        );

        if (classResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Class not found'
            });
        }

        const classData = classResult.rows[0];

        // Get enrollment
        const enrollmentResult = await query(
            `SELECT id, progress FROM enrollments
             WHERE user_id = $1 AND module_id = $2`,
            [req.user.id, classData.module_id]
        );

        if (enrollmentResult.rows.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Not enrolled in this module'
            });
        }

        const enrollment = enrollmentResult.rows[0];
        const progress = enrollment.progress || {};

        // Mark class as complete
        if (!progress.completedClasses) {
            progress.completedClasses = [];
        }

        if (!progress.completedClasses.includes(parseInt(classId))) {
            progress.completedClasses.push(parseInt(classId));
        }

        // Update enrollment progress
        await query(
            `UPDATE enrollments SET progress = $1 WHERE id = $2`,
            [JSON.stringify(progress), enrollment.id]
        );

        res.json({
            success: true,
            message: 'Class marked as complete',
            data: {
                classId: classId,
                progress: progress
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Request level promotion
// @route   POST /api/v1/users/promotion/request
// @access  Private
exports.requestPromotion = async (req, res, next) => {
    try {
        const { moduleId } = req.body;

        // Get enrollment
        const enrollmentResult = await query(
            `SELECT id, promotion_request, promotion_approved FROM enrollments
             WHERE user_id = $1 AND module_id = $2`,
            [req.user.id, moduleId]
        );

        if (enrollmentResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        const enrollment = enrollmentResult.rows[0];

        if (enrollment.promotion_request) {
            return res.status(400).json({
                success: false,
                message: 'Promotion request already submitted'
            });
        }

        // Update enrollment with promotion request
        await query(
            `UPDATE enrollments SET promotion_request = true WHERE id = $1`,
            [enrollment.id]
        );

        res.json({
            success: true,
            message: 'Promotion request submitted successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;
