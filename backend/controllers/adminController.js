const { query, getClient } = require('../config/database');
const bcrypt = require('bcryptjs');

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, role, status, search } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        let params = [];
        let paramCount = 1;

        // Build dynamic WHERE clause
        const conditions = [];

        if (role) {
            conditions.push(`u.role = $${paramCount}`);
            params.push(role);
            paramCount++;
        }

        if (status) {
            conditions.push(`u.status = $${paramCount}`);
            params.push(status);
            paramCount++;
        }

        if (search) {
            conditions.push(`(u.username ILIKE $${paramCount} OR u.email ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`);
            params.push(`%${search}%`);
            paramCount++;
        }

        if (conditions.length > 0) {
            whereClause = 'WHERE ' + conditions.join(' AND ');
        }

        // Get total count
        const countResult = await query(
            `SELECT COUNT(*) FROM users u ${whereClause}`,
            params
        );
        const total = parseInt(countResult.rows[0].count);

        // Get users with pagination and enrollment count
        const result = await query(
            `SELECT u.id, u.username, u.email, u.name, u.phone, u.photo_url, u.role, u.status,
                    u.pretest_score, u.current_level as level, u.created_at, u.updated_at,
                    COUNT(DISTINCT e.id) as enrollment_count
             FROM users u
             LEFT JOIN enrollments e ON u.id = e.user_id
             ${whereClause}
             GROUP BY u.id
             ORDER BY u.created_at DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            [...params, limit, offset]
        );

        res.json({
            success: true,
            data: {
                users: result.rows,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Admin
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `SELECT id, username, email, name, phone, photo_url, role, status,
                    pretest_score, current_level, security_question, created_at, updated_at
             FROM users WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user enrollments
        const enrollments = await query(
            `SELECT e.id, e.status, e.progress, e.enrolled_at, e.completed_at,
                    m.name as module_name, m.slug, m.level
             FROM enrollments e
             JOIN modules m ON e.module_id = m.id
             WHERE e.user_id = $1
             ORDER BY e.enrolled_at DESC`,
            [id]
        );

        // Get user submissions
        const submissions = await query(
            `SELECT s.id, s.status, s.score, s.submitted_at, s.graded_at,
                    a.title as assignment_title, m.name as module_name
             FROM submissions s
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             WHERE s.user_id = $1
             ORDER BY s.submitted_at DESC
             LIMIT 10`,
            [id]
        );

        res.json({
            success: true,
            data: {
                user: result.rows[0],
                enrollments: enrollments.rows,
                recentSubmissions: submissions.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Create new user
// @route   POST /api/v1/admin/users
// @access  Admin
exports.createUser = async (req, res, next) => {
    try {
        const { username, email, password, name, phone, role, status, pretest_score, current_level } = req.body;

        // Generate username from email if not provided
        const finalUsername = username || email.split('@')[0];

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE username = $1 OR email = $2',
            [finalUsername, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const result = await query(
            `INSERT INTO users (username, email, password, name, phone, role, status, pretest_score, current_level)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, username, email, name, phone, role, status, pretest_score, current_level, created_at`,
            [finalUsername, email, hashedPassword, name, phone || null, role || 'user', status || 'active', pretest_score || null, current_level || null]
        );

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/v1/admin/users/:id
// @access  Admin
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, phone, role, status, pretest_score, current_level } = req.body;

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (email !== undefined) fieldsToUpdate.email = email;
        if (phone !== undefined) fieldsToUpdate.phone = phone;
        if (role !== undefined) fieldsToUpdate.role = role;
        if (status !== undefined) fieldsToUpdate.status = status;
        if (pretest_score !== undefined) fieldsToUpdate.pretest_score = pretest_score;
        if (current_level !== undefined) fieldsToUpdate.current_level = current_level;

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
            `UPDATE users SET ${setClause} WHERE id = $${values.length}
             RETURNING id, username, email, name, phone, role, status, pretest_score, current_level`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Check if user exists
        const userCheck = await client.query('SELECT id, role FROM users WHERE id = $1', [id]);

        if (userCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting the last admin
        if (userCheck.rows[0].role === 'admin') {
            const adminCount = await client.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);
            if (parseInt(adminCount.rows[0].count) <= 1) {
                await client.query('ROLLBACK');
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete the last admin user'
                });
            }
        }

        // Delete related records (cascading delete)
        await client.query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);
        await client.query('DELETE FROM submissions WHERE user_id = $1', [id]);
        await client.query('DELETE FROM enrollments WHERE user_id = $1', [id]);
        await client.query('DELETE FROM users WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Get pending approvals
// @route   GET /api/v1/admin/users/pending/approvals
// @access  Admin
exports.getPendingApprovals = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, username, email, name, phone, role, created_at
             FROM users
             WHERE status = 'pending'
             ORDER BY created_at ASC`
        );

        res.json({
            success: true,
            data: {
                pendingUsers: result.rows,
                count: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Approve user
// @route   POST /api/v1/admin/users/:id/approve
// @access  Admin
exports.approveUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await query(
            `UPDATE users SET status = 'active' WHERE id = $1
             RETURNING id, username, email, name, role, status`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // TODO: Send approval email
        // await emailService.sendAccountApproved(result.rows[0].email, result.rows[0].name);

        res.json({
            success: true,
            message: 'User approved successfully',
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Reject user
// @route   POST /api/v1/admin/users/:id/reject
// @access  Admin
exports.rejectUser = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;
        const { reason } = req.body;

        await client.query('BEGIN');

        // Get user info before deletion
        const userResult = await client.query(
            'SELECT email, name FROM users WHERE id = $1 AND status = $2',
            [id, 'pending']
        );

        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Pending user not found'
            });
        }

        const user = userResult.rows[0];

        // Delete the user
        await client.query('DELETE FROM users WHERE id = $1', [id]);

        await client.query('COMMIT');

        // TODO: Send rejection email
        // await emailService.sendAccountRejected(user.email, user.name, reason);

        res.json({
            success: true,
            message: 'User registration rejected'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Get all modules (admin view)
// @route   GET /api/v1/admin/modules
// @access  Admin
exports.getAllModules = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT m.id, m.name, m.slug, m.description, m.level, m.is_active,
                    m.created_at, m.updated_at,
                    COUNT(DISTINCT lm.id) as total_classes,
                    COUNT(DISTINCT a.id) as total_assignments,
                    COUNT(DISTINCT e.id) as total_enrollments
             FROM modules m
             LEFT JOIN learning_materials lm ON m.id = lm.module_id
             LEFT JOIN assignments a ON m.id = a.module_id
             LEFT JOIN enrollments e ON m.id = e.module_id
             GROUP BY m.id
             ORDER BY m.level, m.name`
        );

        res.json({
            success: true,
            data: {
                modules: result.rows
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Create module
// @route   POST /api/v1/admin/modules
// @access  Admin
exports.createModule = async (req, res, next) => {
    try {
        const { name, slug, description, level, is_active } = req.body;

        // Check if slug already exists
        const existingModule = await query('SELECT id FROM modules WHERE slug = $1', [slug]);

        if (existingModule.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Module slug already exists'
            });
        }

        const result = await query(
            `INSERT INTO modules (name, slug, description, level, is_active)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, slug, description || null, level, is_active !== undefined ? is_active : true]
        );

        res.status(201).json({
            success: true,
            message: 'Module created successfully',
            data: {
                module: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update module
// @route   PUT /api/v1/admin/modules/:id
// @access  Admin
exports.updateModule = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, slug, description, level, is_active } = req.body;

        const fieldsToUpdate = {};
        if (name !== undefined) fieldsToUpdate.name = name;
        if (slug !== undefined) fieldsToUpdate.slug = slug;
        if (description !== undefined) fieldsToUpdate.description = description;
        if (level !== undefined) fieldsToUpdate.level = level;
        if (is_active !== undefined) fieldsToUpdate.is_active = is_active;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // Check slug uniqueness if updating slug
        if (slug) {
            const existingModule = await query(
                'SELECT id FROM modules WHERE slug = $1 AND id != $2',
                [slug, id]
            );

            if (existingModule.rows.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Module slug already exists'
                });
            }
        }

        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = [...Object.values(fieldsToUpdate), id];

        const result = await query(
            `UPDATE modules SET ${setClause} WHERE id = $${values.length}
             RETURNING *`,
            values
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        res.json({
            success: true,
            message: 'Module updated successfully',
            data: {
                module: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Delete module
// @route   DELETE /api/v1/admin/modules/:id
// @access  Admin
exports.deleteModule = async (req, res, next) => {
    const client = await getClient();

    try {
        const { id } = req.params;

        await client.query('BEGIN');

        // Check if module exists
        const moduleCheck = await client.query('SELECT id FROM modules WHERE id = $1', [id]);

        if (moduleCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Module not found'
            });
        }

        // Check if module has enrollments
        const enrollmentCheck = await client.query(
            'SELECT COUNT(*) FROM enrollments WHERE module_id = $1',
            [id]
        );

        if (parseInt(enrollmentCheck.rows[0].count) > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'Cannot delete module with active enrollments. Consider deactivating instead.'
            });
        }

        // Delete related records
        await client.query('DELETE FROM submissions WHERE assignment_id IN (SELECT id FROM assignments WHERE module_id = $1)', [id]);
        await client.query('DELETE FROM assignments WHERE module_id = $1', [id]);
        await client.query('DELETE FROM learning_materials WHERE module_id = $1', [id]);
        await client.query('DELETE FROM modules WHERE id = $1', [id]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Module deleted successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        next(error);
    } finally {
        client.release();
    }
};

// @desc    Get admin statistics
// @route   GET /api/v1/admin/statistics
// @access  Admin
exports.getAdminStatistics = async (req, res, next) => {
    try {
        // Get total counts
        const totalCounts = await query(
            `SELECT
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
                (SELECT COUNT(*) FROM modules WHERE is_active = true) as total_modules,
                (SELECT COUNT(*) FROM assignments WHERE is_active = true) as total_assignments,
                (SELECT COUNT(*) FROM users WHERE status = 'pending') as pending_users`
        );

        // Total users by role
        const userStats = await query(
            `SELECT role, status, COUNT(*) as count
             FROM users
             GROUP BY role, status
             ORDER BY role, status`
        );

        // Total modules
        const moduleStats = await query(
            `SELECT level, is_active, COUNT(*) as count
             FROM modules
             GROUP BY level, is_active
             ORDER BY level`
        );

        // Total enrollments
        const enrollmentStats = await query(
            `SELECT status, COUNT(*) as count
             FROM enrollments
             GROUP BY status`
        );

        // Total submissions
        const submissionStats = await query(
            `SELECT status, COUNT(*) as count
             FROM submissions
             GROUP BY status`
        );

        // Recent activity (last 30 days)
        const recentActivity = await query(
            `SELECT
                (SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days') as new_users,
                (SELECT COUNT(*) FROM enrollments WHERE enrolled_at >= NOW() - INTERVAL '30 days') as new_enrollments,
                (SELECT COUNT(*) FROM submissions WHERE submitted_at >= NOW() - INTERVAL '30 days') as new_submissions`
        );

        // Pending items
        const pendingItems = await query(
            `SELECT
                (SELECT COUNT(*) FROM users WHERE status = 'pending') as pending_users,
                (SELECT COUNT(*) FROM submissions WHERE status = 'submitted') as pending_submissions,
                (SELECT COUNT(*) FROM enrollments WHERE promotion_request = true AND promotion_approved IS NULL) as pending_promotions`
        );

        res.json({
            success: true,
            data: {
                // Dashboard summary counts
                total_users: parseInt(totalCounts.rows[0].total_users),
                active_users: parseInt(totalCounts.rows[0].active_users),
                total_modules: parseInt(totalCounts.rows[0].total_modules),
                total_assignments: parseInt(totalCounts.rows[0].total_assignments),
                pending_users: parseInt(totalCounts.rows[0].pending_users),

                // Detailed statistics
                users: userStats.rows,
                modules: moduleStats.rows,
                enrollments: enrollmentStats.rows,
                submissions: submissionStats.rows,
                recentActivity: recentActivity.rows[0],
                pendingItems: pendingItems.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Export users data
// @route   GET /api/v1/admin/export/users
// @access  Admin
exports.exportUsers = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, username, email, name, phone, role, status,
                    pretest_score, current_level, created_at, updated_at
             FROM users
             ORDER BY created_at DESC`
        );

        res.json({
            success: true,
            data: {
                users: result.rows,
                exportedAt: new Date().toISOString(),
                totalRecords: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Export submissions data
// @route   GET /api/v1/admin/export/submissions
// @access  Admin
exports.exportSubmissions = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT s.id, s.status, s.score, s.submitted_at, s.graded_at,
                    u.username, u.email, u.name as student_name,
                    a.title as assignment_title, m.name as module_name, m.level,
                    assessor.name as graded_by
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             JOIN modules m ON a.module_id = m.id
             LEFT JOIN users assessor ON s.graded_by = assessor.id
             ORDER BY s.submitted_at DESC`
        );

        res.json({
            success: true,
            data: {
                submissions: result.rows,
                exportedAt: new Date().toISOString(),
                totalRecords: result.rows.length
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;

// @desc    Admin override submission grade
// @route   PUT /api/v1/admin/submissions/:id/grade
// @access  Admin
exports.overrideSubmissionGrade = async (req, res, next) => {
    const client = await getClient();
    
    try {
        const { id } = req.params;
        const { grade, feedback, override_reason } = req.body;
        const adminId = req.user.id;

        await client.query('BEGIN');

        // Check if submission exists
        const submissionCheck = await client.query(
            'SELECT * FROM submissions WHERE id = $1',
            [id]
        );

        if (submissionCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        const submission = submissionCheck.rows[0];

        // Update submission with admin override
        const updateResult = await client.query(
            `UPDATE submissions
             SET score = $1,
                 feedback = $2,
                 status = 'graded',
                 graded_at = CURRENT_TIMESTAMP,
                 admin_override = true,
                 admin_override_by = $3,
                 admin_override_at = CURRENT_TIMESTAMP,
                 admin_override_reason = $4
             WHERE id = $5
             RETURNING *`,
            [grade, feedback, adminId, override_reason, id]
        );

        // Log the override action in audit log
        await client.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
             VALUES ($1, $2, $3, $4, $5)`,
            [
                adminId,
                'ADMIN_GRADE_OVERRIDE',
                'submission',
                id,
                JSON.stringify({
                    old_score: submission.score,
                    new_score: grade,
                    reason: override_reason,
                    student_id: submission.user_id,
                    assignment_id: submission.assignment_id
                })
            ]
        );

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Grade override successful',
            data: updateResult.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error in overrideSubmissionGrade:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to override grade',
            error: error.message
        });
    } finally {
        client.release();
    }
};

// @desc    Get all submissions (admin view)
// @route   GET /api/v1/admin/submissions
// @access  Admin
exports.getAllSubmissions = async (req, res, next) => {
    try {
        const { status, class_id, assessor_id, page = 1, limit = 50 } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        let params = [];
        let paramCount = 1;
        const conditions = [];

        if (status) {
            if (status === 'pending') {
                conditions.push(`s.status = 'pending'`);
            } else if (status === 'graded') {
                conditions.push(`s.status = 'graded'`);
            } else if (status === 'late') {
                conditions.push(`s.submitted_at > a.due_date`);
            }
        }

        if (conditions.length > 0) {
            whereClause = 'WHERE ' + conditions.join(' AND ');
        }

        const result = await query(
            `SELECT s.id, s.assignment_id, s.user_id, s.file_url, s.submitted_at,
                    s.score, s.feedback, s.graded_at, s.status,
                    s.admin_override, s.admin_override_reason,
                    u.id as student_id, u.name as student_name, u.email as student_email, u.photo_url as student_photo,
                    a.id as assignment_id, a.title as assignment_name, a.class_number, a.due_date,
                    m.id as module_id, m.name as module_name, m.level,
                    c.id as class_id, c.name as class_name, c.code as class_code,
                    grader.id as assessor_id, grader.name as assessor_name, grader.email as assessor_email, grader.photo_url as assessor_photo,
                    CASE WHEN s.submitted_at > a.due_date THEN true ELSE false END as is_late
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             JOIN assignments a ON s.assignment_id = a.id
             LEFT JOIN modules m ON a.module_id = m.id
             LEFT JOIN classes c ON a.class_number = c.id
             LEFT JOIN users grader ON s.graded_by = grader.id
             ${whereClause}
             ORDER BY s.submitted_at DESC
             LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
            [...params, limit, offset]
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error('Error in getAllSubmissions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get submissions',
            error: error.message
        });
    }
};

// @desc    Get all materials (admin view)
// @route   GET /api/v1/admin/materials
// @access  Admin
exports.getAllMaterials = async (req, res, next) => {
    try {
        const { status, module_id } = req.query;

        let whereClause = '';
        let params = [];
        let paramCount = 1;
        const conditions = [];

        if (status) {
            conditions.push(`lm.status = $${paramCount}`);
            params.push(status);
            paramCount++;
        }

        if (module_id) {
            conditions.push(`lm.module_id = $${paramCount}`);
            params.push(module_id);
            paramCount++;
        }

        if (conditions.length > 0) {
            whereClause = 'WHERE ' + conditions.join(' AND ');
        }

        const result = await query(
            `SELECT lm.id, lm.module_id, lm.class_number, lm.title,
                    lm.description, lm.content, lm.is_published,
                    lm.status, lm.download_count,
                    lm.uploaded_by, lm.reviewed_by, lm.reviewed_at, lm.rejection_reason,
                    lm.created_at, lm.updated_at,
                    m.name as module_name,
                    u1.name as uploader_name,
                    u2.name as reviewer_name
             FROM learning_materials lm
             LEFT JOIN modules m ON lm.module_id = m.id
             LEFT JOIN users u1 ON lm.uploaded_by = u1.id
             LEFT JOIN users u2 ON lm.reviewed_by = u2.id
             ${whereClause}
             ORDER BY lm.created_at DESC`,
            params
        );

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error('Error in getAllMaterials:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get materials',
            error: error.message
        });
    }
};

// @desc    Approve material
// @route   PUT /api/v1/admin/materials/:id/approve
// @access  Admin
exports.approveMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        const result = await query(
            `UPDATE learning_materials 
             SET status = 'approved',
                 reviewed_by = $1,
                 reviewed_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [adminId, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Material approved successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error in approveMaterial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve material',
            error: error.message
        });
    }
};

// @desc    Reject material
// @route   PUT /api/v1/admin/materials/:id/reject
// @access  Admin
exports.rejectMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const adminId = req.user.id;

        const result = await query(
            `UPDATE learning_materials 
             SET status = 'rejected',
                 reviewed_by = $1,
                 reviewed_at = CURRENT_TIMESTAMP,
                 rejection_reason = $2
             WHERE id = $3
             RETURNING *`,
            [adminId, reason, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Material rejected',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Error in rejectMaterial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject material',
            error: error.message
        });
    }
};

// @desc    Download material
// @route   GET /api/v1/admin/materials/:id/download
// @access  Admin
exports.downloadMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Increment download count
        const result = await query(
            `UPDATE learning_materials 
             SET download_count = download_count + 1
             WHERE id = $1
             RETURNING content_url, title, type`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        const material = result.rows[0];

        res.status(200).json({
            success: true,
            data: {
                download_url: material.content_url,
                title: material.title,
                type: material.type
            }
        });

    } catch (error) {
        console.error('Error in downloadMaterial:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download material',
            error: error.message
        });
    }
};
