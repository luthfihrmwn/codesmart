const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

// Validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 4, max: 50 })
        .withMessage('Username must be between 4 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name must be less than 100 characters'),
    body('phone')
        .optional()
        .matches(/^[0-9+\-() ]+$/)
        .withMessage('Please provide a valid phone number')
];

const loginValidation = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username or email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const updateDetailsValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Name must be less than 100 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('phone')
        .optional()
        .matches(/^[0-9+\-() ]+$/)
        .withMessage('Please provide a valid phone number')
];

const updatePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
        .custom((value, { req }) => {
            if (value === req.body.currentPassword) {
                throw new Error('New password must be different from current password');
            }
            return true;
        })
];

const forgotPasswordValidation = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email')
];

const resetPasswordValidation = [
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('resetToken')
        .notEmpty()
        .withMessage('Reset token is required')
];

// Routes

// @route   POST /api/v1/auth/register
router.post('/register', registerValidation, validate, authController.register);

// @route   POST /api/v1/auth/login
router.post('/login', loginValidation, validate, authController.login);

// @route   POST /api/v1/auth/refresh
router.post('/refresh', authController.refreshToken);

// @route   POST /api/v1/auth/logout
router.post('/logout', verifyToken, authController.logout);

// @route   GET /api/v1/auth/me
router.get('/me', verifyToken, authController.getMe);

// @route   PUT /api/v1/auth/update-details
router.put('/update-details', verifyToken, updateDetailsValidation, validate, authController.updateDetails);

// @route   PUT /api/v1/auth/update-password
router.put('/update-password', verifyToken, updatePasswordValidation, validate, authController.updatePassword);

// @route   POST /api/v1/auth/forgot-password
router.post('/forgot-password', forgotPasswordValidation, validate, authController.forgotPassword);

// @route   POST /api/v1/auth/verify-security-answer
router.post('/verify-security-answer', authController.verifySecurityAnswer);

// @route   POST /api/v1/auth/reset-password
router.post('/reset-password', resetPasswordValidation, validate, authController.resetPassword);

module.exports = router;
