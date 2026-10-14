import { Router } from 'express';
import {
  getTasks,
  getMyTasks,
  createTask,
  updateTaskStatus,
  submitEvidence,
  syncOfflineTasks,
} from './collectionTask.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getTasks);
router.get('/my-tasks', authorizeRoles('COLLECTION_WORKER', 'DRIVER', 'MUNICIPAL_OFFICER'), getMyTasks);
router.post('/', authorizeRoles('MUNICIPAL_OFFICER', 'SYSTEM_ADMIN'), createTask);
router.patch('/:id', updateTaskStatus);
router.post('/:id/evidence', submitEvidence);
router.post('/sync', authorizeRoles('COLLECTION_WORKER', 'DRIVER'), syncOfflineTasks);

export default router;
