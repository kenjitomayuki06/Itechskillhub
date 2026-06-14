import express from 'express';
import { getAllQuizzes, getQuizById, submitQuiz } from '../controller/quizContrllers/quizController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/quizzes', protect, getAllQuizzes);
router.get('/quizzes/:id', protect, getQuizById);
router.post('/quizzes/:id/submit', protect, submitQuiz);

export default router;