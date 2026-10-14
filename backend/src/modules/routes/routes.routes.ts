import { Router } from 'express';
import { optimizeRoute } from './routes.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post(
  '/optimize',
  authorizeRoles('MUNICIPAL_OFFICER', 'DRIVER', 'SYSTEM_ADMIN'),
  optimizeRoute
);

export default router;
