// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        success: false,
        message: err.message || 'Internal Server Error',
        statusCode: err.statusCode || 500
    };

    // PostgreSQL errors
    if (err.code) {
        switch (err.code) {
            case '23505': // Unique violation
                error.statusCode = 400;
                error.message = 'Duplicate entry. This resource already exists.';
                if (err.constraint) {
                    if (err.constraint.includes('email')) {
                        error.message = 'Email already exists';
                        error.field = 'email';
                    } else if (err.constraint.includes('username')) {
                        error.message = 'Username already exists';
                        error.field = 'username';
                    }
                }
                break;

            case '23503': // Foreign key violation
                error.statusCode = 400;
                error.message = 'Referenced resource does not exist';
                break;

            case '23502': // Not null violation
                error.statusCode = 400;
                error.message = 'Required field is missing';
                break;

            case '22P02': // Invalid text representation
                error.statusCode = 400;
                error.message = 'Invalid input format';
                break;

            default:
                error.message = 'Database error occurred';
        }
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.statusCode = 401;
        error.message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        error.statusCode = 401;
        error.message = 'Token expired';
        error.expired = true;
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        error.message = 'Validation failed';
        error.errors = err.errors;
    }

    // Multer errors (file upload)
    if (err.name === 'MulterError') {
        error.statusCode = 400;
        if (err.code === 'LIMIT_FILE_SIZE') {
            error.message = 'File size is too large';
        } else if (err.code === 'LIMIT_FILE_COUNT') {
            error.message = 'Too many files uploaded';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            error.message = 'Unexpected field in file upload';
        }
    }

    // Development vs Production
    if (process.env.NODE_ENV === 'development') {
        res.status(error.statusCode).json({
            ...error,
            stack: err.stack,
            original: err
        });
    } else {
        res.status(error.statusCode).json(error);
    }
};

module.exports = errorHandler;
