const Blog = require('../models/Blog');

// Create a new blog (isapproved will be false by default)
exports.createBlog = async (req, res) => {
  try {
    const { name, author, type, content, imageURL } = req.body;
    
    if (!name || !author || !type || !content || !imageURL) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBlog = new Blog({
      name,
      author,
      type,
      content,
      imageURL
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog submitted successfully. Awaiting admin approval.', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all approved blogs
exports.getApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isapproved: true }).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
