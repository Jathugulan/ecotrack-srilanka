import { Router } from 'express';
import { getAuditLogs } from './auditLog.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'), getAuditLogs);

export default router;
