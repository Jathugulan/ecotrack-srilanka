import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
  refreshToken,
  registerSchema,
  loginSchema,
} from './auth.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getCurrentUser);

export default router;
