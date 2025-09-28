import express from 'express';
import { getPublishedChapters } from '../controllers/chapter.controller.js';

const router = express.Router();

router.get('/:course_id/published', getPublishedChapters);

export default router;