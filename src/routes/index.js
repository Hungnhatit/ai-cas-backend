import express from 'express';
import authRoutes from './auth.route.js';
import courseRoutes from './course.route.js';
import categoryRoutes from './category.route.js'
import quizRoutes from './quiz.route.js';
import chapterRoutes from './chapter.route.js';
import userProgressRoutes from './user-progress.route.js';
import attemptRoutes from './attempt.route.js';
import studentRoutes from './student.route.js';
import assignmentRoutes from './assignment.route.js';
import fileRoutes from './file.route.js';
import testRoutes from './test.route.js';
import testAttemptRoutes from './test-attempt.route.js';
import aiEvaluationRoutes from './aiEvaluation.route.js';
import userRoutes from './user.route.js'
import testCommentRoutes from './test-comment.route.js';
import competencyRoutes from './competency.route.js';
import postRoutes from './post.route.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/course', courseRoutes);
router.use('/category', categoryRoutes);
router.use('/quizzes', quizRoutes);
router.use('/chapter', chapterRoutes);
router.use('/progress', userProgressRoutes);
router.use('/attempt', attemptRoutes);
router.use('/student', studentRoutes);
router.use('/assignment', assignmentRoutes);
router.use('/file', fileRoutes);
router.use('/ai', aiEvaluationRoutes);
router.use('/user', userRoutes);
router.use('/comment', testCommentRoutes);
router.use('/post', postRoutes);
/**
 * Test routes
 */
router.use('/test', testRoutes);
router.use('/test-attempt', testAttemptRoutes);
router.use('/competency', competencyRoutes);


export default router;