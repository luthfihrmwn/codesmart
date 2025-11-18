const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
const { verifyToken, requireAdmin, requireAssessorOrAdmin, requireRole } = require('../middleware/auth');

/**
 * ML/SVM Routes
 * Base path: /api/v1/ml
 *
 * Role Access:
 * - Admin: All endpoints
 * - Assessor: All except /init
 * - User: /info, /predict, /my-prediction, /predict-user (own only)
 */

// Initialize model (Admin only)
router.post('/init', verifyToken, requireAdmin, mlController.initializeModel);

// Get model info (All authenticated users)
router.get('/info', verifyToken, mlController.getModelInfo);

// Predict level from features (All authenticated users)
router.post('/predict', verifyToken, mlController.predictLevel);

// Get user's own prediction (All authenticated users)
router.get('/my-prediction', verifyToken, mlController.getMyPrediction);

// Predict level for specific user (Admin, Assessor, or User for their own data)
router.post('/predict-user/:userId', verifyToken, mlController.predictUserLevel);

// Batch predict for all users (Admin and Assessor only)
router.post('/batch-predict', verifyToken, requireAssessorOrAdmin, mlController.batchPredict);

// Get SVM statistics (Admin and Assessor only)
router.get('/stats', verifyToken, requireAssessorOrAdmin, mlController.getStats);

module.exports = router;
