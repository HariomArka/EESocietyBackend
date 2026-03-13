const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

// ── Nodemailer transporter ──────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── POST /api/contact  (public) ─────────────────────────────────────────────
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res.status(400).json({ message: 'Please fill all required fields.' });

    // 1. Save to DB
    const doc = await ContactMessage.create({ name, email, phone, subject, message });

    // 2. Notify admin via email
    const adminTo = process.env.EMAIL_ADMIN_TO || 'admin@gmail.com';
    const transporter = createTransporter();

    const subjectLabels = {
      general: 'General Inquiry',
      event: 'Event Request',
      collaboration: 'Collaboration',
      feedback: 'Feedback',
      other: 'Other',
    };
    const subjectLabel = subjectLabels[subject] || subject;

    await transporter.sendMail({
      from: `"EES Contact Form" <${process.env.EMAIL_USER}>`,
      to: adminTo,
      subject: `[EES Contact] New message: ${subjectLabel}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
          <h2 style="color:#1d4ed8;margin-bottom:8px;">New Contact Form Submission</h2>
          <p style="color:#555;margin-bottom:20px;">You received a new message via the EES website contact form.</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;width:120px;">Name</td><td style="padding:8px 0;color:#555;">${name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Email</td><td style="padding:8px 0;color:#555;">${email}</td></tr>
            ${phone ? `<tr><td style="padding:8px 0;font-weight:bold;color:#333;">Phone</td><td style="padding:8px 0;color:#555;">${phone}</td></tr>` : ''}
            <tr><td style="padding:8px 0;font-weight:bold;color:#333;">Subject</td><td style="padding:8px 0;color:#555;">${subjectLabel}</td></tr>
          </table>
          <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;" />
          <h3 style="color:#333;margin-bottom:8px;">Message</h3>
          <p style="color:#555;line-height:1.6;white-space:pre-wrap;">${message}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #ddd;" />
          <p style="color:#999;font-size:12px;">Reply to this message from your Admin Dashboard at /admin → Messages tab.</p>
        </div>`,
    });

    res.status(201).json({ message: 'Message sent successfully.', id: doc._id });
  } catch (error) {
    console.error('Error in submitMessage:', error);
    // Still respond OK to user if the email just failed (DB save worked)
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// ── GET /api/contact  (admin) ───────────────────────────────────────────────
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/contact/:id/reply  (admin) ────────────────────────────────────
exports.replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;
    if (!replyText || !replyText.trim())
      return res.status(400).json({ message: 'Reply text is required.' });

    const doc = await ContactMessage.findById(id);
    if (!doc) return res.status(404).json({ message: 'Message not found.' });

    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"EES Department, IIT Kharagpur" <${process.env.EMAIL_USER}>`,
      to: doc.email,
      subject: `Re: Your message to EES – ${doc.subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9f9f9;padding:24px;border-radius:8px;">
          <h2 style="color:#1d4ed8;margin-bottom:8px;">Reply from EES Department</h2>
          <p style="color:#555;">Dear ${doc.name},</p>
          <p style="color:#555;line-height:1.6;white-space:pre-wrap;">${replyText}</p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
          <p style="color:#999;font-size:12px;">This is a reply to your message submitted via the EES website contact form.</p>
          <p style="color:#999;font-size:12px;">Electrical Engineering Students' Society, IIT Kharagpur</p>
        </div>`,
    });

    doc.isReplied = true;
    doc.repliedAt = new Date();
    await doc.save();

    res.status(200).json({ message: 'Reply sent successfully.', doc });
  } catch (error) {
    console.error('Error replying to message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── DELETE /api/contact/:id  (admin) ────────────────────────────────────────
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await ContactMessage.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Message not found.' });
    res.status(200).json({ message: 'Message deleted successfully.' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
