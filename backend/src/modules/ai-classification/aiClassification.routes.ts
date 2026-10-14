import { Router } from 'express';
import { classifyWaste } from './aiClassification.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/classify-waste', classifyWaste);

export default router;
