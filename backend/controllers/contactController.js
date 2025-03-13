// controllers/contactController.js
import asyncHandler from '../middleware/asyncHandler.js';
import Contact from '../models/contactModel.js';

// @desc    Send a contact message
// @route   POST /api/contact
// @access  Public
export const sendMessage = asyncHandler(async (req, res) => {
  const { fullName, email, message } = req.body;
  
  if (!fullName || !email || !message) {
    throw new Error('All fields are required');
  }

  const contact = await Contact.create({
    fullName,
    email,
    message,
  });

  res.status(201).json(contact);
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
export const getMessages = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({});
  res.json(contacts);
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Admin
export const deleteMessage = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    throw new Error('Contact message not found');
  }

  res.json({ message: 'Contact message deleted successfully' });
});
