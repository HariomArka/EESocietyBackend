const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },
    phone:     { type: String, trim: true, default: '' },
    subject:   { type: String, required: true, trim: true },
    message:   { type: String, required: true },
    isReplied: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
