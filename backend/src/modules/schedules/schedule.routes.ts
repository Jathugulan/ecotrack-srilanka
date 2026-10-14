import { Router } from 'express';
import { getSchedules, createSchedule } from './schedule.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSchedules);
router.post('/', authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'), createSchedule);

export default router;
