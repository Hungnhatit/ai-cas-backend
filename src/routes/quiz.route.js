import express from 'express';
import { createQuiz, deleteQuiz, getQuestions, getQuizById, getQuizByInstructorId, getStudentQuizResult, publishQuiz, restoreQuiz, updateQuiz } from '../controllers/quiz.controller.js';
import { authenticate, authMiddleware } from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/create', authenticate, createQuiz);
router.get('/instructor/:instructor_id', authenticate, getQuizByInstructorId);
router.patch('/restore/:quiz_id', authenticate, restoreQuiz);

// publish quiz
router.post('/:quiz_id/publish', authenticate, publishQuiz);

// update quiz
router.put('/:quiz_id/update', authenticate, updateQuiz);

// get all results of quiz for specific student
router.get('/:quiz_id/student/:student_id/results', getStudentQuizResult);

// delete quiz and related data
router.delete('/remove/:quiz_id', authenticate, deleteQuiz);

//dynamic route
router.get('/:quiz_id', authenticate, getQuizById);

export default router;


