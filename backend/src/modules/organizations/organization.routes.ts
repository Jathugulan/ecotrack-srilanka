import { Router } from 'express';
import { getOrganizations, createOrganization } from './organization.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.get('/', getOrganizations);
router.post('/', authenticate, authorizeRoles('SYSTEM_ADMIN'), createOrganization);

export default router;
