import express from 'express';
import { createTest, getTestById, getTestsByInstructorId } from '../controllers/test/test.controller.js';

const router = express.Router();

router.post('/create', createTest);
router.get('/instructor/:instructor_id', getTestsByInstructorId);
router.get('/:test_id', getTestById);

export default router;