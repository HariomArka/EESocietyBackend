const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const Project = require('../models/Project');

// Admin Login
exports.login = (req, res) => {
  const { username, password } = req.body;

  if (username === 'Admin' && password === 'Admin@123') {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.status(200).json({ message: 'Login successful', token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
};

// ─────────── BLOG MANAGEMENT ───────────

// Get all blogs (for admin dashboard, includes unapproved)
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Approve a blog
exports.approveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    blog.isapproved = true;
    await blog.save();
    res.status(200).json({ message: 'Blog approved successfully', blog });
  } catch (error) {
    console.error('Error approving blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a blog
exports.editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, author, type, content, imageURL, isapproved } = req.body;

    const blog = await Blog.findByIdAndUpdate(
      id,
      { name, author, type, content, imageURL, isapproved },
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Error editing blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────── PROJECT MANAGEMENT ───────────

// Get all projects (admin view)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a project
exports.editProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, professor, description, expectation, duration, numberOfStudents } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      { name, professor, description, expectation, duration, numberOfStudents },
      { new: true, runValidators: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project updated successfully', project });
  } catch (error) {
    console.error('Error editing project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
