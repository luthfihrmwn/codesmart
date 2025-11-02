const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/submissions/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'submission-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx|zip|js|html|css|txt/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            return cb(null, true);
        }
        cb(new Error('Invalid file type'));
    }
});

// Submit assignment
router.post('/', verifyToken, upload.single('file'), (req, res) => {
    res.json({ success: true, message: 'Submit assignment - TODO: Implement', file: req.file });
});

// Get user's submissions
router.get('/my-submissions', verifyToken, (req, res) => {
    res.json({ success: true, message: 'Get user submissions - TODO: Implement' });
});

// Get specific submission
router.get('/:id', verifyToken, (req, res) => {
    res.json({ success: true, message: 'Get submission details - TODO: Implement' });
});

// Update submission (resubmit)
router.put('/:id', verifyToken, upload.single('file'), (req, res) => {
    res.json({ success: true, message: 'Update submission - TODO: Implement' });
});

module.exports = router;
