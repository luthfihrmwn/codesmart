const express = require('express');
const router = express.Router();
const { verifyToken, optionalAuth } = require('../middleware/auth');
const moduleController = require('../controllers/moduleController');

// Get all modules
router.get('/', optionalAuth, moduleController.getModules);

// Get module by slug
router.get('/:slug', optionalAuth, moduleController.getModuleBySlug);

// Get learning materials for a module
router.get('/:slug/materials/:classNumber', verifyToken, moduleController.getClassMaterial);
router.get('/:slug/materials', verifyToken, moduleController.getModuleMaterials);

module.exports = router;
