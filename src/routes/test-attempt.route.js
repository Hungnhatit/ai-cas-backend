import express from 'express';
import { abortTestAttempt, getTestAttemptById, getTestAttempts, startTestAttempt, submitTestAnswers, submitTestAttempt } from '../controllers/test/test-attempt.controller.js';
import { authenticate } from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', getTestAttempts);
router.get('/:attempt_id/result', getTestAttemptById);
router.post('/start', startTestAttempt);
router.post('/:testAttempt_id/submit', submitTestAttempt);

// handle submit test answers
router.post('/:testAttempt_id/submit-answers', submitTestAnswers);

router.post('/:attempt_id/abort', authenticate, abortTestAttempt);

export default router;