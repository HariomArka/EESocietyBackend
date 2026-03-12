const Project = require('../models/Project');

// Create a new Research Project
exports.createProject = async (req, res) => {
  try {
    const { name, professor, description, expectation, duration, numberOfStudents } = req.body;
    
    if (!name || !professor || !description || !expectation || !duration || !numberOfStudents) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProject = new Project({
      name,
      professor,
      description,
      expectation,
      duration,
      numberOfStudents
    });

    await newProject.save();
    res.status(201).json({ message: 'Project submitted successfully.', project: newProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all viewing research projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
