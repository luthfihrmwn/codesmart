const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const assignmentController = require('../controllers/assignmentController');

// Get user's assignments (must be before /:id to avoid conflict)
router.get('/user/my-assignments', verifyToken, assignmentController.getMyAssignments);

// Get assignments for a module
router.get('/module/:moduleSlug', verifyToken, assignmentController.getModuleAssignments);

// Get assignment details
router.get('/:id', verifyToken, assignmentController.getAssignment);

module.exports = router;
