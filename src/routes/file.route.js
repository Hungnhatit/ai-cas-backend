import express from 'express';
import multer from 'multer';
import { bulkUpload, deleteMedia, uploadMediaCloudinary } from '../controllers/file/file.controller.js';

const router = express.Router();
const upload = multer({ dest: '../upload' });

router.post('/upload', upload.single('file'), uploadMediaCloudinary);

// upload multiple file
router.post('/bulk-upload', upload.array('files', 10), bulkUpload);

// delete file
router.delete('/delete/:file_id', deleteMedia);

export default router;