const { query, getClient } = require('../config/database');

// @desc    Get pending submissions
// @route   GET /api/v1/assessor/submissions/pending
// @access  Assessor, Admin
exports.getPendingSubmissions = async (req, res, next) => {
    try {
        const { moduleId, level } = req.query;

        let whereClause = "WHERE s.status = 'pending'";
        let params = [];
        let paramCount = 1;

        if (moduleId) {
            whereClause += ` AND a.module_id = $${paramCount}`;
            params.push(moduleId);
            paramCount++;
        }

        if (level) {
            whereClause += ` AND m.level = $${paramCount}`;
            params.push(level);
            paramCount++;
        }

        const result = await query(
            `SELECT s.id, s.submitted_at, s.file_url, s.file_name,
                    u.id as student_id, u.username, u.name as student_name, u.email,
                    a.id as assignment_id, a.title as assignment_title,
                    m.id as module_id, m.name as module_name, m.level, m.slug
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             ${whereClause}
             ORDER BY s.submitted_at ASC`,
            params
        );

        res.json({
            success: true,
            data: {
                submissions: result.rows,
                count: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get graded submissions
// @route   GET /api/v1/assessor/submissions/graded
// @access  Assessor, Admin
exports.getGradedSubmissions = async (req, res, next) => {
    try {
        const { moduleId, level, gradedBy } = req.query;

        let whereClause = "WHERE s.status = 'graded'";
        let params = [];
        let paramCount = 1;

        if (moduleId) {
            whereClause += ` AND a.module_id = $${paramCount}`;
            params.push(moduleId);
            paramCount++;
        }

        if (level) {
            whereClause += ` AND m.level = $${paramCount}`;
            params.push(level);
            paramCount++;
        }

        if (gradedBy) {
            whereClause += ` AND s.graded_by = $${paramCount}`;
            params.push(gradedBy);
            paramCount++;
        }

        const result = await query(
            `SELECT s.id, s.score, s.feedback, s.submitted_at, s.graded_at,
                    s.file_url, s.file_name,
                    u.id as student_id, u.username, u.name as student_name,
                    a.id as assignment_id, a.title as assignment_title,
                    m.id as module_id, m.name as module_name, m.level,
                    assessor.name as graded_by_name
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             LEFT JOIN users assessor ON s.graded_by = assessor.id
             ${whereClause}
             ORDER BY s.graded_at DESC`,
            params
        );

        res.json({
            success: true,
            data: {
                submissions: result.rows,
                count: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get submission details
// @route   GET /api/v1/assessor/submissions/:id
// @access  Assessor, Admin
exports.getSubmissionDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT s.id, s.status, s.score, s.feedback, s.rubric_scores,
                    s.file_url, s.file_name, s.submitted_at, s.graded_at,
                    u.id as student_id, u.username, u.name as student_name,
                    u.email, u.current_level,
                    a.id as assignment_id, a.title as assignment_title,
                    a.description as assignment_description, a.rubric, a.total_points,
                    m.id as module_id, m.name as module_name, m.level, m.slug,
                    assessor.name as graded_by_name
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             LEFT JOIN users assessor ON s.graded_by = assessor.id
             WHERE s.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Get student's other submissions for this assignment
        const studentHistory = await query(
            `SELECT id, status, score, submitted_at, graded_at
             FROM submissions
             WHERE user_id = $1 AND assignment_id = $2
             ORDER BY submitted_at DESC`,
            [result.rows[0].student_id, result.rows[0].assignment_id]
        );

        res.json({
            success: true,
            data: {
                submission: result.rows[0],
                submissionHistory: studentHistory.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Grade submission
// @route   POST /api/v1/assessor/submissions/:id/grade
// @access  Assessor, Admin
exports.gradeSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { score, feedback, rubric_scores } = req.body;

        // Validate score
        if (score === undefined || score < 0 || score > 100) {
            return res.status(400).json({
                success: false,
                message: 'Score must be between 0 and 100'
            });
        }

        // Get submission and check status
        const submissionCheck = await query(
            `SELECT s.id, s.status, u.email, u.name, a.title
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             WHERE s.id = $1`,
            [id]
        );

        if (submissionCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        if (submissionCheck.rows[0].status === 'graded') {
            return res.status(400).json({
                success: false,
                message: 'Submission already graded. Use update endpoint to modify grade.'
            });
        }

        // Grade submission
        const result = await query(
            `UPDATE submissions
             SET status = 'graded',
                 score = $1,
                 feedback = $2,
                 rubric_scores = $3,
                 graded_by = $4,
                 graded_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [score, feedback || null, JSON.stringify(rubric_scores || {}), req.user.id, id]
        );

        // TODO: Send grading notification email
        // const student = submissionCheck.rows[0];
        // await emailService.sendAssignmentGraded(student.email, student.name, student.title, score);

        res.json({
            success: true,
            message: 'Submission graded successfully',
            data: {
                submission: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update grade
// @route   PUT /api/v1/assessor/submissions/:id/grade
// @access  Assessor, Admin
exports.updateGrade = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { score, feedback, rubric_scores } = req.body;

        // Validate score
        if (score !== undefined && (score < 0 || score > 100)) {
            return res.status(400).json({
                success: false,
                message: 'Score must be between 0 and 100'
            });
        }

        const fieldsToUpdate = {};
        if (score !== undefined) fieldsToUpdate.score = score;
        if (feedback !== undefined) fieldsToUpdate.feedback = feedback;
        if (rubric_scores !== undefined) fieldsToUpdate.rubric_scores = JSON.stringify(rubric_scores);

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
            `UPDATE submissions SET ${setClause} WHERE id = $${values.length} AND status = 'graded'
             RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Graded submission not found'
            });
        }

        res.json({
            success: true,
            message: 'Grade updated successfully',
            data: {
                submission: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get students list
// @route   GET /api/v1/assessor/students
// @access  Assessor, Admin
exports.getStudents = async (req, res, next) => {
    try {
        const { level, search } = req.query;

        let whereClause = "WHERE u.role = 'user'";
        let params = [];
        let paramCount = 1;

        if (level) {
            whereClause += ` AND u.current_level = $${paramCount}`;
            params.push(level);
            paramCount++;
        }

        if (search) {
            whereClause += ` AND (u.username ILIKE $${paramCount} OR u.email ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
            params.push(`%${search}%`);
            paramCount++;
        }

        const result = await query(
            `SELECT u.id, u.username, u.name, u.email, u.current_level,
                    u.pretest_score, u.created_at,
                    COUNT(DISTINCT e.id) as total_enrollments,
                    COUNT(DISTINCT s.id) as total_submissions,
                    COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_submissions,
                    ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score
             FROM users u
             LEFT JOIN enrollments e ON u.id = e.user_id
             LEFT JOIN submissions s ON u.id = s.user_id
             ${whereClause}
             GROUP BY u.id
             ORDER BY u.name`,
            params
        );

        res.json({
            success: true,
            data: {
                students: result.rows,
                count: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get student progress
// @route   GET /api/v1/assessor/students/:id/progress
// @access  Assessor, Admin
exports.getStudentProgress = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get student info
        const student = await query(
            `SELECT id, username, name, email, current_level, pretest_score, created_at
             FROM users WHERE id = $1 AND role = 'user'`,
            [id]
        );

        if (student.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Get enrollments with progress
        const enrollments = await query(
            `SELECT e.id, e.status, e.progress, e.enrolled_at, e.completed_at,
                    e.promotion_request, e.promotion_approved,
                    m.id as module_id, m.name as module_name, m.slug, m.level
             FROM enrollments e
             JOIN modules m ON e.module_id = m.id
             WHERE e.user_id = $1
             ORDER BY e.enrolled_at DESC`,
            [id]
        );

        // Get submissions with grades
        const submissions = await query(
            `SELECT s.id, s.status, s.score, s.feedback, s.submitted_at, s.graded_at,
                    a.title as assignment_title, m.name as module_name,
                    assessor.name as graded_by
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             LEFT JOIN users assessor ON s.graded_by = assessor.id
             WHERE s.user_id = $1
             ORDER BY s.submitted_at DESC`,
            [id]
        );

        // Calculate statistics
        const stats = await query(
            `SELECT
                COUNT(DISTINCT e.id) as total_enrollments,
                COUNT(DISTINCT s.id) as total_submissions,
                COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_submissions,
                COUNT(DISTINCT CASE WHEN s.status = 'submitted' THEN s.id END) as pending_submissions,
                ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score,
                MIN(CASE WHEN s.status = 'graded' THEN s.score END) as lowest_score,
                MAX(CASE WHEN s.status = 'graded' THEN s.score END) as highest_score
             FROM enrollments e
             LEFT JOIN submissions s ON s.user_id = e.user_id
             WHERE e.user_id = $1`,
            [id]
        );

        res.json({
            success: true,
            data: {
                student: student.rows[0],
                enrollments: enrollments.rows,
                submissions: submissions.rows,
                statistics: stats.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get pending promotions
// @route   GET /api/v1/assessor/promotions/pending
// @access  Assessor, Admin
exports.getPendingPromotions = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT e.id, e.progress, e.enrolled_at,
                    u.id as student_id, u.username, u.name as student_name,
                    u.email, u.current_level,
                    m.id as module_id, m.name as module_name, m.level, m.slug,
                    COUNT(DISTINCT s.id) as total_submissions,
                    COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_submissions,
                    ROUND(AVG(CASE WHEN s.status = 'graded' THEN s.score END), 2) as average_score
             FROM enrollments e
             JOIN users u ON e.user_id = u.id
             JOIN modules m ON e.module_id = m.id
             LEFT JOIN assignments a ON m.id = a.module_id
             LEFT JOIN submissions s ON a.id = s.assignment_id AND s.user_id = u.id
             WHERE e.promotion_request = true AND e.promotion_approved IS NULL
             GROUP BY e.id, u.id, m.id
             ORDER BY e.enrolled_at ASC`
        );

        res.json({
            success: true,
            data: {
                promotions: result.rows,
                count: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Approve promotion
// @route   POST /api/v1/assessor/promotions/:id/approve
// @access  Assessor, Admin
exports.approvePromotion = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Get enrollment info
        const enrollmentResult = await client.query(
            `SELECT e.id, e.user_id, e.promotion_request,
                    u.name, u.email, u.current_level,
                    m.level as module_level
             FROM enrollments e
             JOIN users u ON e.user_id = u.id
             JOIN modules m ON e.module_id = m.id
             WHERE e.id = $1`,
            [id]
        );

        if (enrollmentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        const enrollment = enrollmentResult.rows[0];

        if (!enrollment.promotion_request) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'No promotion request for this enrollment'
            });
        }

        // Approve promotion
        await client.query(
            `UPDATE enrollments
             SET promotion_approved = true, status = 'completed', completed_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [id]
        );

        // Determine next level
        let nextLevel = enrollment.current_level;
        if (enrollment.module_level === 'fundamental') {
            nextLevel = 'intermediate';
        } else if (enrollment.module_level === 'intermediate') {
            nextLevel = 'advance';
        }

        // Update user level if promotion advances them
        const levelOrder = { 'fundamental': 1, 'intermediate': 2, 'advance': 3 };
        if (levelOrder[nextLevel] > levelOrder[enrollment.current_level]) {
            await client.query(
                'UPDATE users SET current_level = $1 WHERE id = $2',
                [nextLevel, enrollment.user_id]
            );
        }

        await client.query('COMMIT');

        // TODO: Send promotion notification
        // await emailService.sendPromotionApproved(enrollment.email, enrollment.name, nextLevel);

        res.json({
            success: true,
            message: 'Promotion approved successfully',
            data: {
                newLevel: nextLevel
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Reject promotion
// @route   POST /api/v1/assessor/promotions/:id/reject
// @access  Assessor, Admin
exports.rejectPromotion = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        // Get enrollment info
        const enrollmentResult = await query(
            `SELECT e.id, e.promotion_request, u.name, u.email
             FROM enrollments e
             JOIN users u ON e.user_id = u.id
             WHERE e.id = $1`,
            [id]
        );

        if (enrollmentResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }

        const enrollment = enrollmentResult.rows[0];

        if (!enrollment.promotion_request) {
            return res.status(400).json({
                success: false,
                message: 'No promotion request for this enrollment'
            });
        }

        // Reject promotion
        await query(
            `UPDATE enrollments
             SET promotion_request = false, promotion_approved = false
             WHERE id = $1`,
            [id]
        );

        // TODO: Send rejection notification
        // await emailService.sendPromotionRejected(enrollment.email, enrollment.name, reason);

        res.json({
            success: true,
            message: 'Promotion request rejected',
            data: {
                reason: reason || 'No reason provided'
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get assessor statistics
// @route   GET /api/v1/assessor/statistics
// @access  Assessor, Admin
exports.getAssessorStatistics = async (req, res, next) => {
    try {
        // Grading statistics
        const gradingStats = await query(
            `SELECT
                COUNT(*) as total_graded,
                COUNT(CASE WHEN graded_at >= NOW() - INTERVAL '7 days' THEN 1 END) as graded_last_week,
                COUNT(CASE WHEN graded_at >= NOW() - INTERVAL '30 days' THEN 1 END) as graded_last_month,
                ROUND(AVG(score), 2) as average_score_given
             FROM submissions
             WHERE graded_by = $1`,
            [req.user.id]
        );

        // Pending submissions
        const pendingStats = await query(
            `SELECT
                COUNT(*) as total_pending,
                COUNT(CASE WHEN submitted_at < NOW() - INTERVAL '7 days' THEN 1 END) as overdue_submissions
             FROM submissions
             WHERE status = 'submitted'`
        );

        // Student performance by level
        const performanceByLevel = await query(
            `SELECT m.level,
                    COUNT(DISTINCT s.id) as total_submissions,
                    ROUND(AVG(s.score), 2) as average_score,
                    COUNT(DISTINCT s.user_id) as total_students
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             WHERE s.status = 'graded' AND s.graded_by = $1
             GROUP BY m.level
             ORDER BY m.level`,
            [req.user.id]
        );

        // Recent grading activity
        const recentActivity = await query(
            `SELECT s.id, s.score, s.graded_at,
                    u.name as student_name, a.title as assignment_title,
                    m.name as module_name
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             WHERE s.graded_by = $1
             ORDER BY s.graded_at DESC
             LIMIT 10`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                grading: gradingStats.rows[0],
                pending: pendingStats.rows[0],
                performanceByLevel: performanceByLevel.rows,
                recentActivity: recentActivity.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get all assignments (for assessors)
// @route   GET /api/v1/assessor/assignments
// @access  Assessor, Admin
exports.getAllAssignments = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT a.id, a.title, a.description, a.class_number, a.due_date,
                    a.max_score, a.is_active, a.created_at,
                    m.id as module_id, m.name as module_name, m.slug as module_slug,
                    m.level as module_level,
                    COUNT(DISTINCT s.id) as total_submissions,
                    COUNT(DISTINCT CASE WHEN s.status = 'submitted' THEN s.id END) as pending_submissions,
                    COUNT(DISTINCT CASE WHEN s.status = 'graded' THEN s.id END) as graded_submissions
             FROM assignments a
             JOIN modules m ON a.module_id = m.id
             LEFT JOIN submissions s ON a.id = s.assignment_id
             GROUP BY a.id, m.id
             ORDER BY m.id, a.class_number, a.created_at DESC`
        );

        res.json({
            success: true,
            data: {
                assignments: result.rows,
                count: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;
