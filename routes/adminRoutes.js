const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');

// @route   POST /api/admin/login
router.post('/login', adminController.login);

// ─── BLOG ROUTES ───────────────────────────────────
// Get all blogs
router.get('/blogs', auth, adminController.getAllBlogs);

// Approve a blog
router.put('/blogs/:id/approve', auth, adminController.approveBlog);

// Edit a blog
router.put('/blogs/:id', auth, adminController.editBlog);

// Delete a blog
router.delete('/blogs/:id', auth, adminController.deleteBlog);

// ─── PROJECT ROUTES ────────────────────────────────
// Get all projects
router.get('/projects', auth, adminController.getAllProjects);

// Edit a project
router.put('/projects/:id', auth, adminController.editProject);

// Delete a project
router.delete('/projects/:id', auth, adminController.deleteProject);

module.exports = router;
