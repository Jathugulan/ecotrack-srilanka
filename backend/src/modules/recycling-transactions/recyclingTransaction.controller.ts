import { Response, NextFunction } from 'express';
import { RecyclingTransaction } from './recyclingTransaction.model.js';
import { RewardLedger } from '../rewards/rewardLedger.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function createTransaction(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const {
      residentId,
      recyclingCenterId,
      materials,
      idempotencyKey,
    } = req.body;

    // Check for duplicate transaction
    const existing = await RecyclingTransaction.findOne({ idempotencyKey });
    if (existing) {
      return sendError(res, 'Duplicate transaction detected with this idempotency key', 409);
    }

    // Calculate total points
    let totalPoints = 0;
    const processedMaterials = materials.map((m: any) => {
      const points = Math.round(m.quantity * (m.pointsPerUnit || 10));
      totalPoints += points;
      return {
        ...m,
        awardedPoints: points,
      };
    });

    const transaction = await RecyclingTransaction.create({
      idempotencyKey,
      residentId,
      recyclingCenterId,
      verifiedBy: req.user.userId,
      materials: processedMaterials,
      totalRewardPoints: totalPoints,
      verificationStatus: 'VERIFIED',
      verifiedAt: new Date(),
    });

    // Query last ledger entry to calculate balanceAfter
    const lastEntry = await RewardLedger.findOne({ residentId }).sort({ createdAt: -1 });
    const currentBalance = lastEntry ? lastEntry.balanceAfter : 0;
    const newBalance = currentBalance + totalPoints;

    await RewardLedger.create({
      residentId,
      transactionId: transaction._id,
      transactionType: 'CREDIT',
      points: totalPoints,
      balanceAfter: newBalance,
      description: `Verified recycling: ${materials.map((m: any) => `${m.quantity} ${m.quantityUnit || 'KG'} ${m.category}`).join(', ')}`,
    });

    return sendSuccess(res, 'Recycling transaction verified and reward credited', {
      transaction,
      newBalance,
    }, 201);
  } catch (error) {
    next(error);
  }
}

export async function getTransactions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const query: any = {};
    if (req.user?.role === 'RESIDENT') {
      query.residentId = req.user.userId;
    }

    const txs = await RecyclingTransaction.find(query)
      .sort({ createdAt: -1 })
      .populate('residentId', 'fullName email')
      .populate('recyclingCenterId', 'name address')
      .populate('verifiedBy', 'fullName');

    return sendSuccess(res, 'Transactions retrieved', txs);
  } catch (error) {
    next(error);
  }
}
