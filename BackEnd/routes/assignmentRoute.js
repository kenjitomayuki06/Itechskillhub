import {Router} from 'express';
import { getSubmissionsController } from '../controller/AssignmentController/submissionController.js';
import { createSubmissionController } from '../controller/AssignmentController/createSubmissionController.js';
import { protect } from '../middleware/authMiddleware.js';

const assignmentRouter = Router();

assignmentRouter.get('/submissions', getSubmissionsController);
assignmentRouter.post('/assignments', protect, createSubmissionController);

export default assignmentRouter;