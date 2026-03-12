const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  professor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  expectation: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    enum: ['2 semesters', '4 semesters', 'others'],
    required: true,
  },
  numberOfStudents: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
