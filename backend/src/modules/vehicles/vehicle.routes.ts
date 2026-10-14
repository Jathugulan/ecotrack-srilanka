import { Router } from 'express';
import { getVehicles, createVehicle } from './vehicle.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getVehicles);
router.post('/', authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'), createVehicle);

export default router;
