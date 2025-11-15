const express = require('express');
const router = express.Router();
const {
    exportGrades,
    exportStudentProgress,
    exportClassSummary
} = require('../controllers/exportController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require authentication and assessor/admin role
router.use(verifyToken);
router.use(requireRole('assessor', 'admin'));

/**
 * @route   GET /api/v1/exports/grades
 * @desc    Export grades to Excel/CSV
 * @access  Private (Assessor/Admin only)
 * @query   module_id, assignment_id, format (xlsx|csv)
 */
router.get('/grades', exportGrades);

/**
 * @route   GET /api/v1/exports/student-progress
 * @desc    Export student progress report
 * @access  Private (Assessor/Admin only)
 * @query   student_id (required), module_id
 */
router.get('/student-progress', exportStudentProgress);

/**
 * @route   GET /api/v1/exports/class-summary
 * @desc    Export class summary/statistics
 * @access  Private (Assessor/Admin only)
 * @query   module_id (required)
 */
router.get('/class-summary', exportClassSummary);

module.exports = router;
