const express = require('express');
const router = express.Router();
const {
    getPretestQuestions,
    submitPretest,
    getPretestResults,
    getAllPretestQuestions,
    createPretestQuestion,
    updatePretestQuestion,
    deletePretestQuestion
} = require('../controllers/pretestController');

const { verifyToken, requireRole } = require('../middleware/auth');

// Student routes
router.get('/questions', verifyToken, requireRole('student'), getPretestQuestions);
router.post('/submit', verifyToken, requireRole('student'), submitPretest);
router.get('/results', verifyToken, requireRole('student'), getPretestResults);

// Admin routes
router.get('/admin/questions', verifyToken, requireRole('admin'), getAllPretestQuestions);
router.post('/admin/questions', verifyToken, requireRole('admin'), createPretestQuestion);
router.put('/admin/questions/:id', verifyToken, requireRole('admin'), updatePretestQuestion);
router.delete('/admin/questions/:id', verifyToken, requireRole('admin'), deletePretestQuestion);

module.exports = router;
