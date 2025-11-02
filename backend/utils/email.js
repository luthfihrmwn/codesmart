const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Send email function
exports.sendEmail = async (options) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'CodeSmart <noreply@codesmart.com>',
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };

    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
};

// Email templates
exports.templates = {
    welcome: (name, email) => ({
        subject: 'Welcome to CodeSmart!',
        html: `
            <h1>Welcome to CodeSmart, ${name}!</h1>
            <p>Your account has been successfully created.</p>
            <p>Email: ${email}</p>
            <p>Your account is pending admin approval. You will be notified once it's approved.</p>
            <p>Thank you for joining CodeSmart!</p>
        `
    }),

    accountApproved: (name) => ({
        subject: 'Your CodeSmart Account has been Approved',
        html: `
            <h1>Congratulations, ${name}!</h1>
            <p>Your account has been approved and activated.</p>
            <p>You can now log in and start learning!</p>
            <a href="${process.env.FRONTEND_URL}/src/pages/auth/login.html">Login Now</a>
        `
    }),

    passwordReset: (name, resetToken) => ({
        subject: 'Password Reset Request - CodeSmart',
        html: `
            <h1>Password Reset Request</h1>
            <p>Hi ${name},</p>
            <p>You requested to reset your password.</p>
            <p>Your reset token is: <strong>${resetToken}</strong></p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    }),

    assignmentGraded: (name, assignmentTitle, score) => ({
        subject: `Your assignment "${assignmentTitle}" has been graded`,
        html: `
            <h1>Assignment Graded</h1>
            <p>Hi ${name},</p>
            <p>Your assignment <strong>"${assignmentTitle}"</strong> has been graded.</p>
            <p>Your score: <strong>${score}/100</strong></p>
            <p>Log in to view detailed feedback.</p>
            <a href="${process.env.FRONTEND_URL}/src/pages/user/dashboard.html">View Dashboard</a>
        `
    }),

    promotionApproved: (name, newLevel) => ({
        subject: 'Level Promotion Approved!',
        html: `
            <h1>Congratulations, ${name}!</h1>
            <p>Your promotion request has been approved!</p>
            <p>You can now access: <strong>${newLevel}</strong> level modules.</p>
            <p>Keep up the great work!</p>
            <a href="${process.env.FRONTEND_URL}/src/pages/user/dashboard.html">Start Learning</a>
        `
    })
};
