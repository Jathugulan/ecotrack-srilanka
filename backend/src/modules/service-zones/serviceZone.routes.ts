import { Router } from 'express';
import { getServiceZones, createServiceZone } from './serviceZone.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.get('/', getServiceZones);
router.post(
  '/',
  authenticate,
  authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'),
  createServiceZone
);

export default router;
