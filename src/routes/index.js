import express from 'express';
import authRoutes from './auth.route.js';
import courseRoutes from './course.route.js';
import categoryRoutes from './category.route.js'
import quizRoutes from './quiz.route.js';
import chapterRoutes from './chapter.route.js';
import userProgressRoutes from './user-progress.route.js';
import attemptRoutes from './attempt.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/course', courseRoutes);
router.use('/category', categoryRoutes);
router.use('/quizzes', quizRoutes);
router.use('/chapter', chapterRoutes);
router.use('/progress', userProgressRoutes);
router.use('/attempt', attemptRoutes);

// quiz


export default router;