const express = require('express');
const router = express.Router();
const {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
} = require('../controllers/announcementController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/v1/announcements
 * @desc    Get all announcements (filtered by user role and level)
 * @access  Private
 * @query   limit, offset, is_active
 */
router.get('/', getAnnouncements);

/**
 * @route   GET /api/v1/announcements/:id
 * @desc    Get announcement by ID
 * @access  Private
 */
router.get('/:id', getAnnouncementById);

/**
 * @route   POST /api/v1/announcements
 * @desc    Create announcement
 * @access  Private (Admin/Assessor only)
 * @body    { title, content, target_role, target_level, priority, is_active, published_at }
 */
router.post('/', requireRole('admin', 'assessor'), createAnnouncement);

/**
 * @route   PUT /api/v1/announcements/:id
 * @desc    Update announcement
 * @access  Private (Admin/Author only)
 */
router.put('/:id', requireRole('admin', 'assessor'), updateAnnouncement);

/**
 * @route   DELETE /api/v1/announcements/:id
 * @desc    Delete announcement
 * @access  Private (Admin/Author only)
 */
router.delete('/:id', requireRole('admin', 'assessor'), deleteAnnouncement);

module.exports = router;
