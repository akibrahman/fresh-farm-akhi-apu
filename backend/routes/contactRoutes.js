// routes/contactRoutes.js
import express from 'express';
import { sendMessage, getMessages, deleteMessage } from '../controllers/contactController.js';
import protect from '../middleware/protectMiddleware.js';

const router = express.Router();

router.route('/').post(sendMessage);  // Public route for sending a contact message
router.route('/').get(protect('admin'), getMessages);  // Admin route for getting all contact messages
router.route('/:id').delete(protect('admin'), deleteMessage);  // Admin route for deleting a contact message

export default router;
