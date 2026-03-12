const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// @route   POST /api/projects
// @desc    Create a new research project
// @access  Public (for professors)
router.post('/', projectController.createProject);

// @route   GET /api/projects
// @desc    Get all research projects
// @access  Public
router.get('/', projectController.getProjects);

module.exports = router;
