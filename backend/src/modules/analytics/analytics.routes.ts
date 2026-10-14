import { Router } from 'express';
import {
  getMunicipalAnalytics,
  getResidentAnalytics,
  getRecyclingAnalytics,
} from './analytics.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/municipal', authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'), getMunicipalAnalytics);
router.get('/resident', authorizeRoles('RESIDENT'), getResidentAnalytics);
router.get('/recycling', getRecyclingAnalytics);

export default router;
