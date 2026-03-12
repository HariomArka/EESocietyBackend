const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// @route   POST /api/blogs
// @desc    Create a new blog (public, awaiting approval)
// @access  Public
router.post('/', blogController.createBlog);

// @route   GET /api/blogs
// @desc    Get all approved blogs
// @access  Public
router.get('/', blogController.getApprovedBlogs);

module.exports = router;
