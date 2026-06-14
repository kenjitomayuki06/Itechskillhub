import { Router } from 'express';
import { getAllCoursesController } from '../controller/QueryController/Query.js';
import { getCourseProgressController } from '../controller/coursesController/courseProgressController.js';

const courseRouter = Router();

courseRouter.get('/getAllCourses', getAllCoursesController);
courseRouter.get('/courseProgress/getProgress/:student_id/:course_id', getCourseProgressController);

export default courseRouter;