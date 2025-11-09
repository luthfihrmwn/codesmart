const { query, getClient } = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

// @desc    Submit assignment
// @route   POST /api/v1/submissions
// @access  Private (User)
exports.submitAssignment = async (req, res, next) => {
    try {
        const { assignmentId, notes } = req.body;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Get assignment details
        const assignmentResult = await query(
            `SELECT a.id, a.title, a.module_id, a.due_date,
                    m.name as module_name, m.level
             FROM assignments a
             JOIN modules m ON a.module_id = m.id
             WHERE a.id = $1 AND a.is_active = true`,
            [assignmentId]
        );

        if (assignmentResult.rows.length === 0) {
            // Delete uploaded file if assignment not found
            await fs.unlink(req.file.path);
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const assignment = assignmentResult.rows[0];

        // Check if user is enrolled
        const enrollmentCheck = await query(
            'SELECT id FROM enrollments WHERE user_id = $1 AND module_id = $2',
            [req.user.id, assignment.module_id]
        );

        if (enrollmentCheck.rows.length === 0) {
            await fs.unlink(req.file.path);
            return res.status(403).json({
                success: false,
                message: 'You must be enrolled in this module'
            });
        }

        // Check if already submitted (and not yet graded)
        const existingSubmission = await query(
            `SELECT id, status FROM submissions
             WHERE user_id = $1 AND assignment_id = $2 AND status = 'submitted'`,
            [req.user.id, assignmentId]
        );

        if (existingSubmission.rows.length > 0) {
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'You already have a pending submission for this assignment'
            });
        }

        // Create submission
        const result = await query(
            `INSERT INTO submissions
             (user_id, assignment_id, file_url, file_name, notes, status)
             VALUES ($1, $2, $3, $4, $5, 'submitted')
             RETURNING id, user_id, assignment_id, file_name, notes, status, submitted_at`,
            [
                req.user.id,
                assignmentId,
                req.file.path,
                req.file.originalname,
                notes || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Assignment submitted successfully',
            data: {
                submission: result.rows[0]
            }
        });

    } catch (error) {
        // Clean up uploaded file on error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        next(error);
    }
};

// @desc    Get my submissions
// @route   GET /api/v1/submissions/my-submissions
// @access  Private (User)
exports.getMySubmissions = async (req, res, next) => {
    try {
        const { status, moduleId } = req.query;

        let whereClause = 'WHERE s.user_id = $1';
        let params = [req.user.id];
        let paramCount = 2;

        if (status) {
            whereClause += ` AND s.status = $${paramCount}`;
            params.push(status);
            paramCount++;
        }

        if (moduleId) {
            whereClause += ` AND a.module_id = $${paramCount}`;
            params.push(moduleId);
            paramCount++;
        }

        const result = await query(
            `SELECT s.id, s.status, s.score, s.feedback, s.file_name,
                    s.submitted_at, s.graded_at,
                    a.id as assignment_id, a.title as assignment_title,
                    a.total_points,
                    m.id as module_id, m.name as module_name, m.slug, m.level,
                    assessor.name as graded_by
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             LEFT JOIN users assessor ON s.graded_by = assessor.id
             ${whereClause}
             ORDER BY s.submitted_at DESC`,
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

// @desc    Get submission by ID
// @route   GET /api/v1/submissions/:id
// @access  Private
exports.getSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT s.id, s.user_id, s.status, s.score, s.feedback,
                    s.rubric_scores, s.file_url, s.file_name, s.notes,
                    s.submitted_at, s.graded_at,
                    a.id as assignment_id, a.title as assignment_title,
                    a.description as assignment_description, a.rubric,
                    a.total_points,
                    m.id as module_id, m.name as module_name, m.level,
                    u.username, u.name as student_name, u.email,
                    assessor.name as graded_by
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             JOIN users u ON s.user_id = u.id
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

        const submission = result.rows[0];

        // Check access rights
        if (req.user.role === 'user' && submission.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.json({
            success: true,
            data: {
                submission: submission
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Download submission file
// @route   GET /api/v1/submissions/:id/download
// @access  Private
exports.downloadSubmission = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT s.id, s.user_id, s.file_url, s.file_name
             FROM submissions s
             WHERE s.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        const submission = result.rows[0];

        // Check access rights (only owner or admin/assessor can download)
        if (req.user.role === 'user' && submission.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Check if file exists
        try {
            await fs.access(submission.file_url);
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: 'File not found on server'
            });
        }

        // Send file
        res.download(submission.file_url, submission.file_name);

    } catch (error) {
        next(error);
    }
};

// @desc    Resubmit assignment
// @route   PUT /api/v1/submissions/:id
// @access  Private (User)
exports.resubmitAssignment = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;
        const { notes } = req.body;

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        await client.query('BEGIN');

        // Get existing submission
        const existingSubmission = await client.query(
            `SELECT s.id, s.user_id, s.status, s.file_url, a.module_id
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             WHERE s.id = $1`,
            [id]
        );

        if (existingSubmission.rows.length === 0) {
            await client.query('ROLLBACK');
            await fs.unlink(req.file.path);
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        const submission = existingSubmission.rows[0];

        // Check ownership
        if (submission.user_id !== req.user.id) {
            await client.query('ROLLBACK');
            await fs.unlink(req.file.path);
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Only allow resubmission if graded (for revision)
        if (submission.status !== 'graded') {
            await client.query('ROLLBACK');
            await fs.unlink(req.file.path);
            return res.status(400).json({
                success: false,
                message: 'Can only resubmit graded assignments'
            });
        }

        // Delete old file
        try {
            await fs.unlink(submission.file_url);
        } catch (unlinkError) {
            console.error('Error deleting old file:', unlinkError);
            // Continue anyway
        }

        // Update submission
        const result = await client.query(
            `UPDATE submissions
             SET file_url = $1,
                 file_name = $2,
                 notes = $3,
                 status = 'submitted',
                 score = NULL,
                 feedback = NULL,
                 rubric_scores = NULL,
                 graded_by = NULL,
                 graded_at = NULL,
                 submitted_at = CURRENT_TIMESTAMP
             WHERE id = $4
             RETURNING id, user_id, assignment_id, file_name, notes, status, submitted_at`,
            [req.file.path, req.file.originalname, notes || null, id]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Assignment resubmitted successfully',
            data: {
                submission: result.rows[0]
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        // Clean up uploaded file on error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Error deleting file:', unlinkError);
            }
        }
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Delete submission
// @route   DELETE /api/v1/submissions/:id
// @access  Private (User - only ungraded submissions)
exports.deleteSubmission = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Get submission
        const submissionResult = await client.query(
            'SELECT id, user_id, status, file_url FROM submissions WHERE id = $1',
            [id]
        );

        if (submissionResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        const submission = submissionResult.rows[0];

        // Check ownership
        if (submission.user_id !== req.user.id) {
            await client.query('ROLLBACK');
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Only allow deletion of submitted (not yet graded) submissions
        if (submission.status !== 'submitted') {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Can only delete ungraded submissions'
            });
        }

        // Delete file
        try {
            await fs.unlink(submission.file_url);
        } catch (unlinkError) {
            console.error('Error deleting file:', unlinkError);
            // Continue anyway
        }

        // Delete submission record
        await client.query('DELETE FROM submissions WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Get all submissions for an assignment (Admin)
// @route   GET /api/v1/admin/assignments/:assignmentId/submissions
// @access  Admin
exports.getAssignmentSubmissions = async (req, res, next) => {
    try {
        const { assignmentId } = req.params;

        // Get assignment details first
        const assignmentCheck = await query(
            'SELECT id, title FROM assignments WHERE id = $1',
            [assignmentId]
        );

        if (assignmentCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Get all submissions for this assignment
        const result = await query(
            `SELECT s.id, s.user_id, s.assignment_id, s.file_url, s.file_name,
                    s.status, s.score, s.feedback, s.submitted_at, s.graded_at,
                    u.name as user_name, u.email as user_email,
                    grader.name as graded_by_name,
                    a.max_score, a.title as assignment_title
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             LEFT JOIN users grader ON s.graded_by = grader.id
             WHERE s.assignment_id = $1
             ORDER BY s.submitted_at DESC`,
            [assignmentId]
        );

        res.json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;
