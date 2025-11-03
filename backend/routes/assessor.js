const express = require('express');
const router = express.Router();
const { verifyToken, requireAssessorOrAdmin } = require('../middleware/auth');
const assessorController = require('../controllers/assessorController');
const assignmentController = require('../controllers/assignmentController');

// All assessor routes require authentication and assessor/admin role
router.use(verifyToken, requireAssessorOrAdmin);

// Submissions Management
router.get('/submissions/pending', assessorController.getPendingSubmissions);
router.get('/submissions/graded', assessorController.getGradedSubmissions);
router.get('/submissions/:id', assessorController.getSubmissionDetails);

// Grading
router.post('/submissions/:id/grade', assessorController.gradeSubmission);
router.put('/submissions/:id/grade', assessorController.updateGrade);

// Student Progress
router.get('/students/:id/progress', assessorController.getStudentProgress);
router.get('/students', assessorController.getStudents);

// Promotion Requests
router.get('/promotions/pending', assessorController.getPendingPromotions);
router.post('/promotions/:id/approve', assessorController.approvePromotion);
router.post('/promotions/:id/reject', assessorController.rejectPromotion);

// Statistics
router.get('/statistics', assessorController.getAssessorStatistics);

// Assignment Management (Assessors can create/edit assignments)
router.get('/assignments', (req, res) => {
    res.json({ success: true, message: 'Get assignments list - Use /api/v1/assignments/module/:slug instead' });
});

router.post('/assignments', assignmentController.createAssignment);
router.put('/assignments/:id', assignmentController.updateAssignment);

module.exports = router;
