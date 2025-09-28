import express from 'express';
import { getCourses, getProgress, } from '../controllers/user-progress.controller.js';
import { getCoursesWithProgress } from '../controllers/courses.controller.js';

const router = express.Router();

router.get('/user/:user_id/course-with-progress', getCoursesWithProgress);
router.get("/:user_id/progress/:course_id", getProgress);

export default router;