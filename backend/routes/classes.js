const express = require('express');
const router = express.Router();
const classesController = require('../controllers/classesController');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Public routes (with authentication)
router.get('/', verifyToken, classesController.getClasses);
router.get('/:id', verifyToken, classesController.getClassById);

// Admin only routes
router.post('/', verifyToken, requireAdmin, classesController.createClass);
router.put('/:id', verifyToken, requireAdmin, classesController.updateClass);
router.delete('/:id', verifyToken, requireAdmin, classesController.deleteClass);

module.exports = router;
