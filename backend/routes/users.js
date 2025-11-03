const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

// User profile routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);

// Pretest routes
router.post('/pretest/submit', verifyToken, userController.submitPretest);
router.get('/pretest/result', verifyToken, userController.getPretestResult);

// User enrollment routes
router.get('/enrollments', verifyToken, userController.getUserEnrollments);
router.post('/enrollments', verifyToken, userController.enrollInModule);

// User progress
router.get('/progress', verifyToken, userController.getUserProgress);
router.post('/progress/class/:classId', verifyToken, userController.markClassComplete);

// Promotion requests
router.post('/promotion/request', verifyToken, userController.requestPromotion);

module.exports = router;
