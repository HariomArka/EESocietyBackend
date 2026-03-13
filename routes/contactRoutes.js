const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');

// Public – submit a contact form message
router.post('/', contactController.submitMessage);

// Admin-protected routes
router.get('/', auth, contactController.getAllMessages);
router.post('/:id/reply', auth, contactController.replyMessage);
router.delete('/:id', auth, contactController.deleteMessage);

module.exports = router;
