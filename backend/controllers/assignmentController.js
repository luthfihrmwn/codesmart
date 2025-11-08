const { query, getClient } = require('../config/database');

// @desc    Get all assignments (Admin only)
// @route   GET /api/v1/admin/assignments
// @access  Admin
exports.getAllAssignments = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT a.id, a.title, a.description, a.max_score, a.due_date, a.is_active,
                    a.requirements, a.rubric, a.class_number, a.created_at, a.updated_at,
                    m.id as module_id, m.name as module_name, m.slug as module_slug,
                    COUNT(DISTINCT s.id) as submission_count
             FROM assignments a
             INNER JOIN modules m ON a.module_id = m.id
             LEFT JOIN submissions s ON a.id = s.assignment_id
             GROUP BY a.id, m.id, m.name, m.slug
             ORDER BY a.created_at DESC`
        );

        res.json({
            success: true,
            data: {
                assignments: result.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get module assignments
// @route   GET /api/v1/assignments/module/:moduleSlug
// @access  Private
exports.getModuleAssignments = async (req, res, next) => {
    try {
        const { moduleSlug } = req.params;

        // Get module
        const moduleResult = await query(
            'SELECT id, name, level FROM modules WHERE slug = $1 AND is_active = true',
            [moduleSlug]
        );

        if (moduleResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        const module = moduleResult.rows[0];

        // Check enrollment for regular users
        if (req.user.role === 'user') {
            const enrollmentCheck = await query(
                'SELECT id FROM enrollments WHERE user_id = $1 AND module_id = $2',
                [req.user.id, module.id]
            );

            if (enrollmentCheck.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be enrolled in this module'
                });
            }
        }

        // Get assignments
        const result = await query(
            `SELECT a.id, a.title, a.description, a.class_number,
                    a.due_date, a.total_points, a.is_active, a.created_at,
                    COUNT(s.id) as total_submissions,
                    COUNT(CASE WHEN s.user_id = $1 THEN 1 END) as user_submissions,
                    MAX(CASE WHEN s.user_id = $1 THEN s.status END) as user_submission_status,
                    MAX(CASE WHEN s.user_id = $1 THEN s.score END) as user_score
             FROM assignments a
             LEFT JOIN submissions s ON a.id = s.assignment_id
             WHERE a.module_id = $2 AND a.is_active = true
             GROUP BY a.id
             ORDER BY a.class_number, a.created_at`,
            [req.user.id, module.id]
        );

        res.json({
            success: true,
            data: {
                module: module,
                assignments: result.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get assignment by ID
// @route   GET /api/v1/assignments/:id
// @access  Private
exports.getAssignment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT a.id, a.title, a.description, a.class_number, a.rubric,
                    a.due_date, a.total_points, a.is_active, a.created_at,
                    m.id as module_id, m.name as module_name, m.slug, m.level
             FROM assignments a
             JOIN modules m ON a.module_id = m.id
             WHERE a.id = $1 AND a.is_active = true`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        const assignment = result.rows[0];

        // Check enrollment for regular users
        if (req.user.role === 'user') {
            const enrollmentCheck = await query(
                'SELECT id FROM enrollments WHERE user_id = $1 AND module_id = $2',
                [req.user.id, assignment.module_id]
            );

            if (enrollmentCheck.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'You must be enrolled in this module'
                });
            }
        }

        // Get user's submissions for this assignment
        const submissions = await query(
            `SELECT id, status, score, feedback, file_name, submitted_at, graded_at
             FROM submissions
             WHERE assignment_id = $1 AND user_id = $2
             ORDER BY submitted_at DESC`,
            [id, req.user.id]
        );

        res.json({
            success: true,
            data: {
                assignment: assignment,
                submissions: submissions.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user's assignments
// @route   GET /api/v1/assignments/user/my-assignments
// @access  Private (User)
exports.getMyAssignments = async (req, res, next) => {
    try {
        const { status } = req.query; // pending, submitted, graded

        let statusFilter = '';
        if (status === 'pending') {
            statusFilter = 'AND s.id IS NULL';
        } else if (status === 'submitted') {
            statusFilter = "AND s.status = 'submitted'";
        } else if (status === 'graded') {
            statusFilter = "AND s.status = 'graded'";
        }

        const result = await query(
            `SELECT a.id, a.title, a.description, a.class_number,
                    a.due_date, a.total_points,
                    m.id as module_id, m.name as module_name, m.slug, m.level,
                    s.id as submission_id, s.status as submission_status,
                    s.score, s.submitted_at, s.graded_at,
                    CASE
                        WHEN s.id IS NULL THEN 'not_submitted'
                        WHEN s.status = 'submitted' THEN 'pending_review'
                        WHEN s.status = 'graded' THEN 'completed'
                    END as assignment_status
             FROM enrollments e
             JOIN modules m ON e.module_id = m.id
             JOIN assignments a ON m.id = a.module_id AND a.is_active = true
             LEFT JOIN (
                SELECT DISTINCT ON (assignment_id)
                    id, assignment_id, user_id, status, score, submitted_at, graded_at
                FROM submissions
                WHERE user_id = $1
                ORDER BY assignment_id, submitted_at DESC
             ) s ON a.id = s.assignment_id
             WHERE e.user_id = $1 ${statusFilter}
             ORDER BY
                CASE
                    WHEN s.id IS NULL AND a.due_date IS NOT NULL THEN 1
                    WHEN s.status = 'submitted' THEN 2
                    ELSE 3
                END,
                a.due_date NULLS LAST,
                a.created_at DESC`,
            [req.user.id]
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

// @desc    Create assignment (Admin)
// @route   POST /api/v1/assignments
// @access  Admin
exports.createAssignment = async (req, res, next) => {
    try {
        const {
            module_id,
            title,
            description,
            class_number,
            rubric,
            due_date,
            total_points,
            is_active
        } = req.body;

        // Check if module exists
        const moduleCheck = await query('SELECT id FROM modules WHERE id = $1', [module_id]);

        if (moduleCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        // Create assignment
        const result = await query(
            `INSERT INTO assignments
             (module_id, title, description, class_number, rubric, due_date, total_points, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                module_id,
                title,
                description || null,
                class_number || null,
                JSON.stringify(rubric || {}),
                due_date || null,
                total_points || 100,
                is_active !== undefined ? is_active : true
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            data: {
                assignment: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update assignment (Admin)
// @route   PUT /api/v1/assignments/:id
// @access  Admin
exports.updateAssignment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            class_number,
            rubric,
            due_date,
            total_points,
            is_active
        } = req.body;

        const fieldsToUpdate = {};
        if (title !== undefined) fieldsToUpdate.title = title;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (class_number !== undefined) fieldsToUpdate.class_number = class_number;
        if (rubric !== undefined) fieldsToUpdate.rubric = JSON.stringify(rubric);
        if (due_date !== undefined) fieldsToUpdate.due_date = due_date;
        if (total_points !== undefined) fieldsToUpdate.total_points = total_points;
        if (is_active !== undefined) fieldsToUpdate.is_active = is_active;

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
            `UPDATE assignments SET ${setClause} WHERE id = $${values.length}
             RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        res.json({
            success: true,
            message: 'Assignment updated successfully',
            data: {
                assignment: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete assignment (Admin)
// @route   DELETE /api/v1/assignments/:id
// @access  Admin
exports.deleteAssignment = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Check if assignment exists
        const assignmentCheck = await client.query(
            'SELECT id FROM assignments WHERE id = $1',
            [id]
        );

        if (assignmentCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if there are submissions
        const submissionCheck = await client.query(
            'SELECT COUNT(*) FROM submissions WHERE assignment_id = $1',
            [id]
        );

        if (parseInt(submissionCheck.rows[0].count) > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Cannot delete assignment with existing submissions. Consider deactivating instead.'
            });
        }

        // Delete assignment
        await client.query('DELETE FROM assignments WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Assignment deleted successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

module.exports = exports;
