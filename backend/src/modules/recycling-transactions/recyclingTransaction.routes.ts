import { Router } from 'express';
import { createTransaction, getTransactions } from './recyclingTransaction.controller.js';
import { authenticate, authorizeRoles } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorizeRoles('RECYCLING_PARTNER', 'SYSTEM_ADMIN'),
  createTransaction
);
router.get('/', getTransactions);

export default router;
