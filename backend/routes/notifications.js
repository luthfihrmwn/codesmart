const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    createBulkNotifications
} = require('../controllers/notificationController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/v1/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 * @query   limit (default: 50), offset (default: 0), unread_only (boolean)
 */
router.get('/', getNotifications);

/**
 * @route   GET /api/v1/notifications/unread-count
 * @desc    Get unread notifications count
 * @access  Private
 */
router.get('/unread-count', getUnreadCount);

/**
 * @route   PUT /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.put('/:id/read', markAsRead);

/**
 * @route   PUT /api/v1/notifications/mark-all-read
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.put('/mark-all-read', markAllAsRead);

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', deleteNotification);

/**
 * @route   POST /api/v1/notifications
 * @desc    Create notification (admin/system use)
 * @access  Private (Admin/Assessor)
 * @body    { user_id, type, title, message, link, metadata }
 */
router.post('/', createNotification);

/**
 * @route   POST /api/v1/notifications/bulk
 * @desc    Create bulk notifications (admin/system use)
 * @access  Private (Admin/Assessor)
 * @body    { user_ids[], type, title, message, link, metadata }
 */
router.post('/bulk', createBulkNotifications);

module.exports = router;
