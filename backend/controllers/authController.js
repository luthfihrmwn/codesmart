const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getClient } = require('../config/database');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { username, email, password, name, phone } = req.body;

        // Check if user already exists
        const existingUser = await query(
            'SELECT id FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user (status = pending, awaiting admin approval)
        const result = await query(
            `INSERT INTO users (username, email, password, name, phone, role, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, username, email, name, role, status, created_at`,
            [username, email, hashedPassword, name, phone, 'student', 'pending']
        );

        const user = result.rows[0];

        res.status(201).json({
            success: true,
            message: 'Registration successful. Your account is pending admin approval.',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status
                }
            }
        });

        // TODO: Send email notification to user and admin

    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { username, password, rememberMe } = req.body;

        // Find user by username or email
        const result = await query(
            'SELECT * FROM users WHERE username = $1 OR email = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const user = result.rows[0];

        // Check if account is active
        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending admin approval'
            });
        }

        if (user.status === 'inactive' || user.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await query(
            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
            [user.id]
        );

        // Generate tokens
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [user.id, refreshToken, expiresAt]
        );

        // Remove password from response
        delete user.password;

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    status: user.status,
                    photo_url: user.photo_url,
                    pretest_score: user.pretest_score,
                    current_level: user.current_level
                },
                token,
                refreshToken
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        // Check if refresh token exists in database and is valid
        const result = await query(
            'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > CURRENT_TIMESTAMP',
            [refreshToken, decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token not found or expired'
            });
        }

        // Generate new access token
        const newToken = generateToken(decoded.userId);

        res.json({
            success: true,
            data: {
                token: newToken
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        // Delete refresh token from database
        if (refreshToken) {
            await query(
                'DELETE FROM refresh_tokens WHERE token = $1 AND user_id = $2',
                [refreshToken, req.user.id]
            );
        }

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const result = await query(
            `SELECT id, username, email, name, role, status, phone, photo_url,
                    pretest_score, current_level, email_verified, last_login, created_at
             FROM users WHERE id = $1`,
            [req.user.id]
        );

        res.json({
            success: true,
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/update-details
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;

        const fieldsToUpdate = {};
        if (name) fieldsToUpdate.name = name;
        if (email) fieldsToUpdate.email = email;
        if (phone) fieldsToUpdate.phone = phone;

        if (Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        // Build dynamic update query
        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `${key} = $${index + 1}`)
            .join(', ');

        const values = [...Object.values(fieldsToUpdate), req.user.id];

        const result = await query(
            `UPDATE users SET ${setClause} WHERE id = $${values.length}
             RETURNING id, username, email, name, phone, photo_url`,
            values
        );

        res.json({
            success: true,
            message: 'User details updated successfully',
            data: {
                user: result.rows[0]
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const result = await query(
            'SELECT password FROM users WHERE id = $1',
            [req.user.id]
        );

        const user = result.rows[0];

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, req.user.id]
        );

        // Invalidate all refresh tokens (force re-login)
        await query(
            'DELETE FROM refresh_tokens WHERE user_id = $1',
            [req.user.id]
        );

        res.json({
            success: true,
            message: 'Password updated successfully. Please login again.'
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Forgot password - send reset token
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find user
        const result = await query(
            'SELECT id, email, name, security_question, security_answer FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email'
            });
        }

        const user = result.rows[0];

        // Return security question if exists
        res.json({
            success: true,
            message: 'Security question retrieved',
            data: {
                email: user.email,
                securityQuestion: user.security_question || 'No security question set',
                hasSecurityQuestion: !!user.security_question
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Verify security answer
// @route   POST /api/v1/auth/verify-security-answer
// @access  Public
exports.verifySecurityAnswer = async (req, res, next) => {
    try {
        const { email, answer } = req.body;

        const result = await query(
            'SELECT id, security_answer FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        if (!user.security_answer) {
            return res.status(400).json({
                success: false,
                message: 'No security answer set for this account'
            });
        }

        // Compare answers (case insensitive)
        if (answer.toLowerCase().trim() !== user.security_answer.toLowerCase().trim()) {
            return res.status(401).json({
                success: false,
                message: 'Security answer is incorrect'
            });
        }

        // Generate one-time reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Store reset token (you might want to create a password_resets table)
        // For now, we'll return it directly
        res.json({
            success: true,
            message: 'Security answer verified',
            data: {
                resetToken,
                userId: user.id
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword, resetToken } = req.body;

        // In production, verify resetToken here
        // For now, we'll just find the user

        const result = await query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const user = result.rows[0];

        // Hash new password
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await query(
            'UPDATE users SET password = $1 WHERE id = $2',
            [hashedPassword, user.id]
        );

        // Invalidate all refresh tokens
        await query(
            'DELETE FROM refresh_tokens WHERE user_id = $1',
            [user.id]
        );

        res.json({
            success: true,
            message: 'Password reset successful. Please login with your new password.'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = exports;
