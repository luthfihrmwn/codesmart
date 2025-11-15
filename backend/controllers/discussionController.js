const { pool } = require('../config/database');

/**
 * Get all discussions (with filters)
 */
exports.getDiscussions = async (req, res) => {
    try {
        const { module_id, assignment_id, limit = 20, offset = 0 } = req.query;

        let query = `
            SELECT
                d.*,
                u.name as author_name,
                u.role as author_role,
                COUNT(DISTINCT dr.id) as replies_count,
                MAX(dr.created_at) as last_reply_at
            FROM discussions d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN discussion_replies dr ON d.id = dr.discussion_id
            WHERE 1=1
        `;

        const params = [];

        if (module_id) {
            params.push(module_id);
            query += ` AND d.module_id = $${params.length}`;
        }

        if (assignment_id) {
            params.push(assignment_id);
            query += ` AND d.assignment_id = $${params.length}`;
        }

        query += `
            GROUP BY d.id, u.name, u.role
            ORDER BY d.is_pinned DESC,
                     COALESCE(MAX(dr.created_at), d.created_at) DESC
            LIMIT $${params.length + 1} OFFSET $${params.length + 2}
        `;

        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                discussions: result.rows,
                total: result.rowCount
            }
        });
    } catch (error) {
        console.error('Error fetching discussions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching discussions',
            error: error.message
        });
    }
};

/**
 * Get single discussion with replies
 */
exports.getDiscussionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Get discussion
        const discussionResult = await pool.query(
            `SELECT
                d.*,
                u.name as author_name,
                u.role as author_role,
                m.name as module_name,
                a.title as assignment_title
            FROM discussions d
            LEFT JOIN users u ON d.user_id = u.id
            LEFT JOIN modules m ON d.module_id = m.id
            LEFT JOIN assignments a ON d.assignment_id = a.id
            WHERE d.id = $1`,
            [id]
        );

        if (discussionResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Get replies
        const repliesResult = await pool.query(
            `SELECT
                dr.*,
                u.name as author_name,
                u.role as author_role
            FROM discussion_replies dr
            LEFT JOIN users u ON dr.user_id = u.id
            WHERE dr.discussion_id = $1
            ORDER BY dr.created_at ASC`,
            [id]
        );

        // Increment views count
        await pool.query(
            'UPDATE discussions SET views_count = views_count + 1 WHERE id = $1',
            [id]
        );

        res.json({
            success: true,
            data: {
                discussion: discussionResult.rows[0],
                replies: repliesResult.rows
            }
        });
    } catch (error) {
        console.error('Error fetching discussion:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching discussion',
            error: error.message
        });
    }
};

/**
 * Create discussion
 */
exports.createDiscussion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { module_id, assignment_id, title, content } = req.body;

        // Validate required fields
        if (!module_id || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Module ID, title, and content are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO discussions (module_id, assignment_id, user_id, title, content)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [module_id, assignment_id || null, userId, title, content]
        );

        // Create notification for assessors
        await createDiscussionNotification(result.rows[0], req.user);

        res.status(201).json({
            success: true,
            message: 'Discussion created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating discussion',
            error: error.message
        });
    }
};

/**
 * Create reply to discussion
 */
exports.createReply = async (req, res) => {
    try {
        const userId = req.user.id;
        const { discussion_id } = req.params;
        const { content, is_solution } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Content is required'
            });
        }

        // Check if discussion exists and not locked
        const discussionCheck = await pool.query(
            'SELECT * FROM discussions WHERE id = $1',
            [discussion_id]
        );

        if (discussionCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        if (discussionCheck.rows[0].is_locked) {
            return res.status(403).json({
                success: false,
                message: 'This discussion is locked'
            });
        }

        const result = await pool.query(
            `INSERT INTO discussion_replies (discussion_id, user_id, content, is_solution)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [discussion_id, userId, content, is_solution || false]
        );

        // Update discussion updated_at
        await pool.query(
            'UPDATE discussions SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
            [discussion_id]
        );

        // Notify discussion author about reply
        await createReplyNotification(discussion_id, result.rows[0], req.user);

        res.status(201).json({
            success: true,
            message: 'Reply created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating reply:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating reply',
            error: error.message
        });
    }
};

/**
 * Pin/Unpin discussion (assessor/admin only)
 */
exports.togglePin = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE discussions
             SET is_pinned = NOT is_pinned
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        res.json({
            success: true,
            message: `Discussion ${result.rows[0].is_pinned ? 'pinned' : 'unpinned'}`,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error toggling pin:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling pin',
            error: error.message
        });
    }
};

/**
 * Lock/Unlock discussion (assessor/admin only)
 */
exports.toggleLock = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE discussions
             SET is_locked = NOT is_locked
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        res.json({
            success: true,
            message: `Discussion ${result.rows[0].is_locked ? 'locked' : 'unlocked'}`,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error toggling lock:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling lock',
            error: error.message
        });
    }
};

/**
 * Mark reply as solution (assessor/admin only)
 */
exports.markAsSolution = async (req, res) => {
    try {
        const { reply_id } = req.params;

        // First, unmark all previous solutions for this discussion
        const replyCheck = await pool.query(
            'SELECT discussion_id FROM discussion_replies WHERE id = $1',
            [reply_id]
        );

        if (replyCheck.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reply not found'
            });
        }

        const discussionId = replyCheck.rows[0].discussion_id;

        // Unmark all previous solutions
        await pool.query(
            'UPDATE discussion_replies SET is_solution = FALSE WHERE discussion_id = $1',
            [discussionId]
        );

        // Mark this reply as solution
        const result = await pool.query(
            'UPDATE discussion_replies SET is_solution = TRUE WHERE id = $1 RETURNING *',
            [reply_id]
        );

        res.json({
            success: true,
            message: 'Reply marked as solution',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error marking as solution:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking as solution',
            error: error.message
        });
    }
};

/**
 * Delete discussion (author/admin only)
 */
exports.deleteDiscussion = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check if discussion exists and user has permission
        const checkResult = await pool.query(
            'SELECT * FROM discussions WHERE id = $1',
            [id]
        );

        if (checkResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Discussion not found'
            });
        }

        // Only admin or author can delete
        if (userRole !== 'admin' && checkResult.rows[0].user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this discussion'
            });
        }

        await pool.query('DELETE FROM discussions WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Discussion deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting discussion:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting discussion',
            error: error.message
        });
    }
};

/**
 * Helper: Create notification for new discussion
 */
async function createDiscussionNotification(discussion, author) {
    try {
        // Get all assessors
        const assessorsResult = await pool.query(
            "SELECT id FROM users WHERE role = 'assessor'"
        );

        if (assessorsResult.rowCount > 0) {
            const values = assessorsResult.rows.map((assessor, index) => {
                const offset = index * 6;
                return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
            }).join(', ');

            const params = [];
            assessorsResult.rows.forEach(assessor => {
                params.push(
                    assessor.id,
                    'comment',
                    'New Discussion',
                    `${author.name} started a discussion: "${discussion.title}"`,
                    null,
                    JSON.stringify({ discussion_id: discussion.id, module_id: discussion.module_id })
                );
            });

            await pool.query(
                `INSERT INTO notifications (user_id, type, title, message, link, metadata)
                 VALUES ${values}`,
                params
            );
        }
    } catch (error) {
        console.error('Error creating discussion notification:', error);
    }
}

/**
 * Helper: Create notification for new reply
 */
async function createReplyNotification(discussionId, reply, author) {
    try {
        // Get discussion author
        const discussionResult = await pool.query(
            'SELECT user_id, title FROM discussions WHERE id = $1',
            [discussionId]
        );

        if (discussionResult.rowCount > 0) {
            const discussion = discussionResult.rows[0];

            // Don't notify if replying to own discussion
            if (discussion.user_id !== author.id) {
                await pool.query(
                    `INSERT INTO notifications (user_id, type, title, message, link, metadata)
                     VALUES ($1, $2, $3, $4, $5, $6)`,
                    [
                        discussion.user_id,
                        'comment',
                        'New Reply',
                        `${author.name} replied to your discussion: "${discussion.title}"`,
                        null,
                        JSON.stringify({ discussion_id: discussionId, reply_id: reply.id })
                    ]
                );
            }
        }
    } catch (error) {
        console.error('Error creating reply notification:', error);
    }
}
