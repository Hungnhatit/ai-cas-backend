import express from 'express';
import { createAttachment, createCourse, deleteCourseById, getCourseById, getCourseDetail, getCourses, getCoursesByUserId, publishCourse, updateCourseById } from '../controllers/courses.controller.js';
import { deleteAttachment } from '../controllers/attachment.controller.js';
import { createChapter, deleteChapter, getChapterById, publishChapter, reorderChapters, unPublishChapter, updateChapter } from '../controllers/chapter.controller.js';


const router = express.Router();

router.get('/', getCourses);
router.get('/get-course-by-user/:ma_nguoi_dung', getCoursesByUserId);
router.get('/course-detail/:course_id', getCourseDetail);
router.get('/detail/:id', getCourseById);

// get course with cate
// router.get("/category", getCoursesWithCate);

router.post('/create-new-course', createCourse);
router.put('/update-course/:id', updateCourseById);

router.patch('/:course_id/publish', publishCourse);
router.patch('/:course_id/unpublish', unPublishChapter);

router.post('/:id/attachment', createAttachment);
router.delete('/:course_id/attachment/:attachment_id', deleteAttachment);
router.delete('/:course_id', deleteCourseById);

router.put('/:course_id/chapter/reorder', reorderChapters);
router.get('/:course_id/chapter/:chapter_id', getChapterById);
router.post('/:id/chapter', createChapter);
router.put('/:course_id/chapter/:chapter_id', updateChapter);
router.delete('/:course_id/chapter/:chapter_id', deleteChapter);

router.patch('/:course_id/chapter/:chapter_id/publish', publishChapter);
router.patch('/:course_id/chapter/:chapter_id/unpublish', unPublishChapter);

export default router;

