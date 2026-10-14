import { Router } from 'express';
import {
  getRecyclingCenters,
  getNearbyRecyclingCenters,
  createRecyclingCenter,
} from './recyclingCenter.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.get('/', getRecyclingCenters);
router.get('/nearby', getNearbyRecyclingCenters);
router.post(
  '/',
  authenticate,
  authorizeRoles('SYSTEM_ADMIN', 'RECYCLING_PARTNER'),
  createRecyclingCenter
);

export default router;
