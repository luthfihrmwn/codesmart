const { pool } = require('../config/database');

/**
 * Get all announcements (with filtering for students)
 */
exports.getAnnouncements = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;
        const { limit = 20, offset = 0, is_active = 'true' } = req.query;

        let query = `
            SELECT
                a.*,
                u.name as author_name,
                u.photo_url as author_photo
            FROM announcements a
            LEFT JOIN users u ON a.author_id = u.id
            WHERE 1=1
        `;

        const params = [];

        // Filter by active status
        if (is_active === 'true') {
            query += ` AND a.is_active = TRUE`;
        }

        // Filter by target role (students only see announcements targeted to them)
        if (userRole === 'student') {
            query += ` AND (a.target_role IN ('all', 'student'))`;

            // Filter by student's current level
            const userResult = await pool.query('SELECT current_level FROM users WHERE id = $1', [userId]);
            if (userResult.rows[0]?.current_level) {
                const currentLevel = userResult.rows[0].current_level;
                query += ` AND (a.target_level IN ('all', $${params.length + 1}))`;
                params.push(currentLevel);
            }
        } else if (userRole === 'assessor') {
            query += ` AND (a.target_role IN ('all', 'assessor'))`;
        }

        query += ` ORDER BY a.priority DESC, a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const result = await pool.query(query, params);

        res.json({
            success: true,
            data: {
                announcements: result.rows,
                total: result.rowCount
            }
        });
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching announcements',
            error: error.message
        });
    }
};

/**
 * Get single announcement by ID
 */
exports.getAnnouncementById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                a.*,
                u.name as author_name,
                u.photo_url as author_photo
            FROM announcements a
            LEFT JOIN users u ON a.author_id = u.id
            WHERE a.id = $1`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching announcement',
            error: error.message
        });
    }
};

/**
 * Create announcement (admin/assessor only)
 */
exports.createAnnouncement = async (req, res) => {
    try {
        const authorId = req.user.id;
        const { title, content, target_role, target_level, priority, is_active, published_at } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }

        const result = await pool.query(
            `INSERT INTO announcements
             (title, content, author_id, target_role, target_level, priority, is_active, published_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [
                title,
                content,
                authorId,
                target_role || 'all',
                target_level || 'all',
                priority || 'normal',
                is_active !== undefined ? is_active : true,
                published_at || new Date()
            ]
        );

        // Create notifications for targeted users if published
        if (result.rows[0].is_active) {
            await createAnnouncementNotifications(result.rows[0]);
        }

        res.status(201).json({
            success: true,
            message: 'Announcement created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating announcement',
            error: error.message
        });
    }
};

/**
 * Update announcement (admin/author only)
 */
exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;
        const { title, content, target_role, target_level, priority, is_active } = req.body;

        // Check if announcement exists and user has permission
        const checkResult = await pool.query(
            'SELECT * FROM announcements WHERE id = $1',
            [id]
        );

        if (checkResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Only admin or author can update
        if (userRole !== 'admin' && checkResult.rows[0].author_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to update this announcement'
            });
        }

        const result = await pool.query(
            `UPDATE announcements
             SET
                title = COALESCE($1, title),
                content = COALESCE($2, content),
                target_role = COALESCE($3, target_role),
                target_level = COALESCE($4, target_level),
                priority = COALESCE($5, priority),
                is_active = COALESCE($6, is_active),
                updated_at = CURRENT_TIMESTAMP
             WHERE id = $7
             RETURNING *`,
            [title, content, target_role, target_level, priority, is_active, id]
        );

        res.json({
            success: true,
            message: 'Announcement updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating announcement',
            error: error.message
        });
    }
};

/**
 * Delete announcement (admin/author only)
 */
exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Check if announcement exists and user has permission
        const checkResult = await pool.query(
            'SELECT * FROM announcements WHERE id = $1',
            [id]
        );

        if (checkResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Announcement not found'
            });
        }

        // Only admin or author can delete
        if (userRole !== 'admin' && checkResult.rows[0].author_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this announcement'
            });
        }

        await pool.query('DELETE FROM announcements WHERE id = $1', [id]);

        res.json({
            success: true,
            message: 'Announcement deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting announcement',
            error: error.message
        });
    }
};

/**
 * Helper function to create notifications for announcement
 */
async function createAnnouncementNotifications(announcement) {
    try {
        let userQuery = 'SELECT id FROM users WHERE 1=1';
        const params = [];

        // Filter by target role
        if (announcement.target_role && announcement.target_role !== 'all') {
            userQuery += ` AND role = $${params.length + 1}`;
            params.push(announcement.target_role);
        }

        // Filter by target level (for students)
        if (announcement.target_level && announcement.target_level !== 'all') {
            userQuery += ` AND current_level = $${params.length + 1}`;
            params.push(announcement.target_level);
        }

        const usersResult = await pool.query(userQuery, params);

        if (usersResult.rowCount > 0) {
            const values = usersResult.rows.map((user, index) => {
                const offset = index * 6;
                return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5}, $${offset + 6})`;
            }).join(', ');

            const notificationParams = [];
            usersResult.rows.forEach(user => {
                notificationParams.push(
                    user.id,
                    'info',
                    announcement.title,
                    announcement.content.substring(0, 200) + (announcement.content.length > 200 ? '...' : ''),
                    null,
                    JSON.stringify({ announcement_id: announcement.id })
                );
            });

            await pool.query(
                `INSERT INTO notifications (user_id, type, title, message, link, metadata)
                 VALUES ${values}`,
                notificationParams
            );
        }
    } catch (error) {
        console.error('Error creating announcement notifications:', error);
    }
}
