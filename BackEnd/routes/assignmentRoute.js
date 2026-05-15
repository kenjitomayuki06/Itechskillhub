import {Router} from 'express';
import { getSubmissionsController } from '../controller/AssignmentController/submissionController.js';
import { createSubmissionController } from '../controller/AssignmentController/createSubmissionController.js';
const assignmentRouter = Router();



assignmentRouter.get('/submissions', getSubmissionsController);
assignmentRouter.post('/assignments', createSubmissionController);
export default assignmentRouter;