import { Router } from 'express';
import {
  createReport,
  getReports,
  getReportById,
  updateReportStatus,
  requestReview,
  getNearbyReports,
  createReportSchema,
} from './wasteReport.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validate.js';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createReportSchema), createReport);
router.get('/', getReports);
router.get('/nearby', getNearbyReports);
router.get('/:id', getReportById);
router.patch(
  '/:id/status',
  authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'),
  updateReportStatus
);
router.post('/:id/review-request', authorizeRoles('RESIDENT'), requestReview);

export default router;
