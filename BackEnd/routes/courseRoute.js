import { Router } from 'express';
import { getAllCoursesController } from '../controller/QueryController/Query.js';
import { getCourseProgressController } from '../controller/coursesController/courseProgressController.js';
import { updateLessonProgressController } from '../controller/coursesController/updateProgressController.js';

const courseRouter = Router();

courseRouter.get('/getAllCourses', getAllCoursesController);
courseRouter.get('/courseProgress/getProgress/:student_id/:course_id', getCourseProgressController);
courseRouter.post('/courseProgress/updateProgress', updateLessonProgressController);

export default courseRouter;