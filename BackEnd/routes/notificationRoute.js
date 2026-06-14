import express from 'express';
import { getStudentNotifications } from '../controller/notificationController/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student/notifications', protect, getStudentNotifications);

export default router;