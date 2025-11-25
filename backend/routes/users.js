const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Multer configuration for profile photo upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// User profile routes
router.get('/profile', verifyToken, userController.getUserProfile);
router.put('/profile', verifyToken, userController.updateUserProfile);
router.post('/profile/photo', verifyToken, upload.single('photo'), userController.uploadProfilePhoto);
router.put('/profile/password', verifyToken, userController.updatePassword);

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
