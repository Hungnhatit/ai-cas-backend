import express from 'express';
import { forceDeleteUser, getUserById, getUsers, restoreUser, softDeleteUser, updateUser } from '../controllers/user.controller.js';
const router = express.Router();

router.get('/', getUsers);
router.patch('/:user_id/update', updateUser)
router.patch('/:user_id/soft-delete', softDeleteUser);
router.patch('/:user_id/restore', restoreUser);
router.delete('/:user_id', forceDeleteUser);
router.get('/:user_id/detail', getUserById);



export default router;