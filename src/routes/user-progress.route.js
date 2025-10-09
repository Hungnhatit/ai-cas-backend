import express from 'express';
import { getCourses, getProgress, } from '../controllers/user-progress.controller.js';
import { getCoursesWithProgress } from '../controllers/courses.controller.js';

const router = express.Router();

router.get('/user/:ma_nguoi_dung/course-with-progress', getCoursesWithProgress);
router.get("/:ma_nguoi_dung/progress/:course_id", getProgress);

export default router;