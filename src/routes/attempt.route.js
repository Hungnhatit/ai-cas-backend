import express from 'express';
import { getQuizAttempt, getQuizAttemptById, getQuizAttempts, startQuizAttempt, submitQuizAnswer, submitQuizAttempt } from '../controllers/attempt.controller.js';

const router = express.Router();

router.get('/', getQuizAttempts);
router.get('/student/:student_id', getQuizAttempt);
router.post('/start', startQuizAttempt);
router.patch('/:attempt_id', submitQuizAnswer);
// router.patch('/:attempt_id/submit', submitQuizAttempt);

// handle submit answer
router.post('/:ma_lan_lam_kt/answer', submitQuizAnswer);

router.post('/:ma_lan_lam_kt/submit', submitQuizAttempt);

// get quiz attempt by ID
router.get('/:ma_lan_lam_kt', getQuizAttemptById);

export default router;