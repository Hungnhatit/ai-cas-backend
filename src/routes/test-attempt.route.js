import express from 'express';
import { startTestAttempt } from '../controllers/test/test-attempt.controller.js';

const router = express.Router();

router.post('/start', startTestAttempt);

export default router;