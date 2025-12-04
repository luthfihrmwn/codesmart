const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const moduleRoutes = require('./routes/modules');
const assignmentRoutes = require('./routes/assignments');
const submissionRoutes = require('./routes/submissions');
const adminRoutes = require('./routes/admin');
const assessorRoutes = require('./routes/assessor');
const notificationRoutes = require('./routes/notifications');
const announcementRoutes = require('./routes/announcements');
const discussionRoutes = require('./routes/discussions');
const exportRoutes = require('./routes/exports');
const analyticsRoutes = require('./routes/analytics');
const mlRoutes = require('./routes/ml');
const classesRoutes = require('./routes/classes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.API_VERSION || 'v1';

// ===========================================
// MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resource sharing
}));

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:8000',
        'http://localhost:8080',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(`/api/${API_VERSION}/`, limiter);

// Static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: API_VERSION
    });
});

// API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/modules`, moduleRoutes);
app.use(`/api/${API_VERSION}/assignments`, assignmentRoutes);
app.use(`/api/${API_VERSION}/submissions`, submissionRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/assessor`, assessorRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/announcements`, announcementRoutes);
app.use(`/api/${API_VERSION}/discussions`, discussionRoutes);
app.use(`/api/${API_VERSION}/exports`, exportRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/ml`, mlRoutes);
app.use(`/api/${API_VERSION}/classes`, classesRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Welcome to CodeSmart API',
        version: API_VERSION,
        docs: `/api/${API_VERSION}/docs`,
        health: '/health'
    });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ===========================================
// SERVER START
// ===========================================

const server = app.listen(PORT, () => {
    console.log('');
    console.log('===========================================');
    console.log('🚀 CodeSmart Backend Server');
    console.log('===========================================');
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Server running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api/${API_VERSION}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
    console.log('===========================================');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('👋 SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;
