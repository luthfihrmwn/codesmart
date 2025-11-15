const express = require('express');
const router = express.Router();
const {
    getDashboardAnalytics,
    getStudentPerformance,
    getModuleCompletionRates,
    getGradeDistribution,
    getEngagementMetrics,
    getAtRiskStudents
} = require('../controllers/analyticsController');
const { verifyToken, requireRole } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get comprehensive dashboard analytics (role-based)
 * @access  Private
 */
router.get('/dashboard', getDashboardAnalytics);

/**
 * @route   GET /api/v1/analytics/student-performance
 * @desc    Get student performance over time
 * @access  Private (Assessor/Admin)
 * @query   student_id (required), module_id, days (default: 30)
 */
router.get('/student-performance', requireRole('assessor', 'admin'), getStudentPerformance);

/**
 * @route   GET /api/v1/analytics/module-completion
 * @desc    Get module completion rates
 * @access  Private (Assessor/Admin)
 */
router.get('/module-completion', requireRole('assessor', 'admin'), getModuleCompletionRates);

/**
 * @route   GET /api/v1/analytics/grade-distribution
 * @desc    Get grade distribution statistics
 * @access  Private (Assessor/Admin)
 * @query   module_id, assignment_id
 */
router.get('/grade-distribution', requireRole('assessor', 'admin'), getGradeDistribution);

/**
 * @route   GET /api/v1/analytics/engagement
 * @desc    Get engagement metrics (activity, active users)
 * @access  Private (Assessor/Admin)
 * @query   days (default: 30)
 */
router.get('/engagement', requireRole('assessor', 'admin'), getEngagementMetrics);

/**
 * @route   GET /api/v1/analytics/at-risk-students
 * @desc    Get list of at-risk students (predictive analytics)
 * @access  Private (Assessor/Admin)
 */
router.get('/at-risk-students', requireRole('assessor', 'admin'), getAtRiskStudents);

module.exports = router;
