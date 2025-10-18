import express from 'express';
import { createTest, deleteTest, getTestById, getTestResults, getTests, getTestsByInstructorId, restoreTest, updateTest } from '../controllers/test/test.controller.js';
import { authenticate } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/create', createTest);
router.get('/instructor/:instructor_id', getTestsByInstructorId);
router.get('/:test_id/student/:student_id/results', getTestResults);
router.get('/all-tests', getTests);

router.put('/:test_id/update', authenticate, updateTest);

router.delete('/remove/:test_id', authenticate, deleteTest);

router.patch('/:test_id/restore', restoreTest);

router.get('/:test_id', getTestById);

export default router;