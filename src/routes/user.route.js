import express from 'express';
import { forceDeleteUser, getUserById, getUsers, restoreUser, softDeleteUser, updateUser } from '../controllers/user.controller.js';
import multer from 'multer';
const router = express.Router();

const upload = multer({ dest: '../upload' });

router.get('/', getUsers);
router.patch('/:user_id/', upload.single('anh_dai_dien'), updateUser)
router.patch('/:user_id/soft-delete', softDeleteUser);
router.patch('/:user_id/restore', restoreUser);
router.delete('/:user_id', forceDeleteUser);
router.get('/:user_id/detail', getUserById);

export default router;