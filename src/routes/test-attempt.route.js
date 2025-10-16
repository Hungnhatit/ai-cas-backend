import express from 'express';
import { getTestAttemptById, getTestAttempts, startTestAttempt, submitTestAnswers, submitTestAttempt } from '../controllers/test/test-attempt.controller.js';

const router = express.Router();

router.get('/', getTestAttempts);
router.get('/:attempt_id/result', getTestAttemptById);
router.post('/start', startTestAttempt);
router.post('/:testAttempt_id/submit', submitTestAttempt);

// handle submit test answers
router.post('/:testAttempt_id/submit-answers', submitTestAnswers);

export default router;