const { pool } = require('../config/database');

/**
 * Get all notifications for current user
 */
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 50, offset = 0, unread_only = false } = req.query;

        let query = `
            SELECT
                id,
                type,
                title,
                message,
                link,
                is_read,
                created_at,
                read_at,
                metadata
            FROM notifications
            WHERE user_id = $1
        `;

        const params = [userId];

        if (unread_only === 'true') {
            query += ` AND is_read = FALSE`;
        }

        query += ` ORDER BY created_at DESC LIMIT $2 OFFSET $3`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        // Get unread count
        const unreadResult = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
            [userId]
        );

        res.json({
            success: true,
            data: {
                notifications: result.rows,
                total: result.rowCount,
                unread_count: parseInt(unreadResult.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications',
            error: error.message
        });
    }
};

/**
 * Get unread notifications count
 */
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = FALSE',
            [userId]
        );

        res.json({
            success: true,
            data: {
                unread_count: parseInt(result.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching unread count',
            error: error.message
        });
    }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
             WHERE id = $1 AND user_id = $2
             RETURNING *`,
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification marked as read',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking notification as read',
            error: error.message
        });
    }
};

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
             WHERE user_id = $1 AND is_read = FALSE
             RETURNING id`,
            [userId]
        );

        res.json({
            success: true,
            message: `${result.rowCount} notifications marked as read`,
            data: {
                count: result.rowCount
            }
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking all notifications as read',
            error: error.message
        });
    }
};

/**
 * Delete notification
 */
exports.deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM notifications WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting notification',
            error: error.message
        });
    }
};

/**
 * Create notification (admin/system use)
 */
exports.createNotification = async (req, res) => {
    try {
        const { user_id, type, title, message, link, metadata } = req.body;

        // Validate required fields
        if (!user_id || !type || !title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: user_id, type, title, message'
            });
        }

        const result = await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, link, metadata)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [user_id, type, title, message, link || null, metadata || null]
        );

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating notification',
            error: error.message
        });
    }
};

/**
 * Create bulk notifications (admin/system use)
 */
exports.createBulkNotifications = async (req, res) => {
    try {
        const { user_ids, type, title, message, link, metadata } = req.body;

        // Validate required fields
        if (!user_ids || !Array.isArray(user_ids) || !type || !title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: user_ids (array), type, title, message'
            });
        }

        const values = user_ids.map((userId, index) => {
            const offset = index * 6;
            return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
        }).join(', ');

        const params = [];
        user_ids.forEach(userId => {
            params.push(userId, type, title, message, link || null, metadata || null);
        });

        const result = await pool.query(
            `INSERT INTO notifications (user_id, type, title, message, link, metadata)
             VALUES ${values}
             RETURNING id`,
            params
        );

        res.status(201).json({
            success: true,
            message: `${result.rowCount} notifications created successfully`,
            data: {
                count: result.rowCount
            }
        });
    } catch (error) {
        console.error('Error creating bulk notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating bulk notifications',
            error: error.message
        });
    }
};
