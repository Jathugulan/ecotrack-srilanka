import { Router } from 'express';
import { getRewardBalance, getRewardHistory } from './rewards.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/balance', getRewardBalance);
router.get('/transactions', getRewardHistory);

export default router;
