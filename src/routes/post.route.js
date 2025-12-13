import multer from 'multer';
import express from 'express';
import { createPost, deletePost, getPostById, getPostByInstructorId, updatePost } from '../controllers/post/post.controller.js';

const router = express.Router();
const upload = multer({ dest: '../upload' });

router.post('/create', upload.fields([
  { name: 'anh_bia', maxCount: 1 },
  { name: 'files', maxCount: 20 }
]), createPost);

router.get('/instructor/:ma_tac_gia', getPostByInstructorId);

router.get('/:post_id', getPostById);
router.put("/:id", updatePost);
router.patch("/:id", upload.fields([
  { name: 'anh_bia', maxCount: 1 },
  { name: 'files', maxCount: 20 }
]), updatePost);

router.delete("/:id", deletePost);

export default router;