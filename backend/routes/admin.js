const express = require('express');
const router = express.Router();
const { verifyToken, requireAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const assignmentController = require('../controllers/assignmentController');
const moduleController = require('../controllers/moduleController');

// All admin routes require authentication and admin role
router.use(verifyToken, requireAdmin);

// User Management
router.get('/users/pending/approvals', adminController.getPendingApprovals); // Must be before /users/:id
router.get('/users/:id', adminController.getUserById);
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// User Approval
router.post('/users/:id/approve', adminController.approveUser);
router.post('/users/:id/reject', adminController.rejectUser);

// Module Management
router.get('/modules', adminController.getAllModules);
router.post('/modules', adminController.createModule);
router.put('/modules/:id', adminController.updateModule);
router.delete('/modules/:id', adminController.deleteModule);

// Learning Materials Management (Admin can use moduleController methods)
router.post('/materials', moduleController.createLearningMaterial);
router.put('/materials/:id', moduleController.updateLearningMaterial);
router.delete('/materials/:id', moduleController.deleteLearningMaterial);

// Assignment Management
router.get('/assignments', assignmentController.getAllAssignments);
router.post('/assignments', assignmentController.createAssignment);
router.put('/assignments/:id', assignmentController.updateAssignment);
router.delete('/assignments/:id', assignmentController.deleteAssignment);

// Statistics
router.get('/statistics', adminController.getAdminStatistics);

// Data Export/Import
router.get('/export/users', adminController.exportUsers);
router.get('/export/submissions', adminController.exportSubmissions);

router.post('/import', (req, res) => {
    res.json({ success: true, message: 'Import data - TODO: Implement in future version' });
});

module.exports = router;
