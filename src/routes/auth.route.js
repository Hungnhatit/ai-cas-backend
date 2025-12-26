import express from 'express';
import { forgotPassword, login, register, resetPassword } from '../controllers/auth/auth.controller.js';
import { authenticate, authMiddleware } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/login', login);
router.post('/sign-up', register);
router.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;