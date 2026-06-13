import express from 'express';
import { getStudentDashboardData } from '../controller/StudentController/studentDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/student/dashboard', protect, getStudentDashboardData);

export default router;