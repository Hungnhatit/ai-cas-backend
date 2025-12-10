import multer from 'multer';
import express from 'express';
import { createPost } from '../controllers/post/post.controller.js';

const router = express.Router();
const upload = multer({ dest: '../upload' });

router.post('/create', upload.array('files', 10), createPost)

export default router;