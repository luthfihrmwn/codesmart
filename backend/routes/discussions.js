const express = require('express');
const router = express.Router();
const {
    getDiscussions,
    getDiscussionById,
    createDiscussion,
    createReply,
    getDiscussionReplies,
    togglePin,
    toggleLock,
    markAsSolution,
    deleteDiscussion
} = require('../controllers/discussionController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/v1/discussions
 * @desc    Get all discussions (with filters)
 * @access  Private
 * @query   module_id, assignment_id, limit, offset
 */
router.get('/', getDiscussions);

/**
 * @route   GET /api/v1/discussions/:id
 * @desc    Get single discussion with replies
 * @access  Private
 */
router.get('/:id', getDiscussionById);

/**
 * @route   POST /api/v1/discussions
 * @desc    Create new discussion
 * @access  Private
 * @body    { module_id, assignment_id, title, content }
 */
router.post('/', createDiscussion);

/**
 * @route   GET /api/v1/discussions/:id/replies
 * @desc    Get all replies for a discussion
 * @access  Private
 */
router.get('/:id/replies', getDiscussionReplies);

/**
 * @route   POST /api/v1/discussions/:discussion_id/replies
 * @desc    Create reply to discussion
 * @access  Private
 * @body    { content, is_solution }
 */
router.post('/:discussion_id/replies', createReply);

/**
 * @route   PUT /api/v1/discussions/:id/pin
 * @desc    Pin/Unpin discussion
 * @access  Private (Assessor/Admin only)
 */
router.put('/:id/pin', requireRole('assessor', 'admin'), togglePin);

/**
 * @route   PUT /api/v1/discussions/:id/lock
 * @desc    Lock/Unlock discussion
 * @access  Private (Assessor/Admin only)
 */
router.put('/:id/lock', requireRole('assessor', 'admin'), toggleLock);

/**
 * @route   PUT /api/v1/discussions/replies/:reply_id/solution
 * @desc    Mark reply as solution
 * @access  Private (Assessor/Admin only)
 */
router.put('/replies/:reply_id/solution', requireRole('assessor', 'admin'), markAsSolution);

/**
 * @route   DELETE /api/v1/discussions/:id
 * @desc    Delete discussion
 * @access  Private (Author/Admin only)
 */
router.delete('/:id', deleteDiscussion);

module.exports = router;
