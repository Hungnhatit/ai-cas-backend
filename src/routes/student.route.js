import express from 'express'
import { createStudent, getStudentsByInstructorId } from '../controllers/student.controller.js';
import { authenticate } from '../middlewares/checkAuth.js';

const router = express.Router();

// create new student
router.post('/create', createStudent);


router.get('/instructor/:ma_giang_vien', authenticate, getStudentsByInstructorId);








export default router;