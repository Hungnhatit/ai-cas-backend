import express from 'express';
import { login, signup } from '../controllers/auth/auth.controller.js';
import { authenticate, authMiddleware } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/login', login);
router.post('/sign-up', signup);
router.get("/me", authenticate, (req, res) => {
  res.json(req.user); 
});


export default router;