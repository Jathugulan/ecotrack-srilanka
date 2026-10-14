import { Response, NextFunction } from 'express';
import { RewardLedger } from './rewardLedger.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function getRewardBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const lastEntry = await RewardLedger.findOne({ residentId: req.user.userId }).sort({ createdAt: -1 });
    const balance = lastEntry ? lastEntry.balanceAfter : 0;

    return sendSuccess(res, 'Balance retrieved', { balance });
  } catch (error) {
    next(error);
  }
}

export async function getRewardHistory(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const history = await RewardLedger.find({ residentId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(res, 'Reward history retrieved', history);
  } catch (error) {
    next(error);
  }
}
