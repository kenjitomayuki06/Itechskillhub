import {Router} from 'express';
// import { courseProgressController } from '../controller/CourseController/courseProgressController.js';
import {getAllCoursesController} from '../controller/QueryController/Query.js';

const courseRouter = Router();

// courseRouter.get('/courseProgress/getProgress/:student_id/:course_id', courseProgressController)
courseRouter.get('/getAllCourses', getAllCoursesController)
export default courseRouter;