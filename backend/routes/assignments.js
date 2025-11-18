const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin, isAssessor } = require('../middleware/auth');
const assignmentController = require('../controllers/assignmentController');

// Get all assignments (for assessors/admins)
router.get('/', verifyToken, assignmentController.getAllAssignments);

// Get user's assignments (must be before /:id to avoid conflict)
router.get('/user/my-assignments', verifyToken, assignmentController.getMyAssignments);

// Get assignments for a module
router.get('/module/:moduleSlug', verifyToken, assignmentController.getModuleAssignments);

// Create new assignment (assessor/admin only)
router.post('/', verifyToken, assignmentController.createAssignment);

// Update assignment (assessor/admin only)
router.put('/:id', verifyToken, assignmentController.updateAssignment);

// Delete assignment (assessor/admin only)
router.delete('/:id', verifyToken, assignmentController.deleteAssignment);

// Get assignment details
router.get('/:id', verifyToken, assignmentController.getAssignment);

module.exports = router;
