import express from 'express';
import { createComment, deleteComment, getCommentsByTestId, updateComment } from "../controllers/test/test-comment.controller.js";
import { authenticate } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/', createComment);
router.get("/test/:test_id", getCommentsByTestId);
router.put("/:id", updateComment);
router.delete("/:comment_id", authenticate, deleteComment);

export default router;