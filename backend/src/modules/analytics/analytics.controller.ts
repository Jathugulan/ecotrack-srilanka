import { Response, NextFunction } from 'express';
import { WasteReport } from '../waste-reports/wasteReport.model.js';
import { CollectionTask } from '../collection-tasks/collectionTask.model.js';
import { RecyclingTransaction } from '../recycling-transactions/recyclingTransaction.model.js';
import { RewardLedger } from '../rewards/rewardLedger.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess } from '../../utils/response.js';

export async function getMunicipalAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const orgQuery: any = {};
    if (req.user?.organizationId && req.user.role !== 'SYSTEM_ADMIN') {
      orgQuery.organizationId = req.user.organizationId;
    }

    const [
      totalReports,
      submittedReports,
      inProgressReports,
      resolvedReports,
      reportsByCategory,
      reportsByStatus,
      totalTasks,
      completedTasks,
      recentReports,
    ] = await Promise.all([
      WasteReport.countDocuments(orgQuery),
      WasteReport.countDocuments({ ...orgQuery, status: 'SUBMITTED' }),
      WasteReport.countDocuments({ ...orgQuery, status: { $in: ['UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS'] } }),
      WasteReport.countDocuments({ ...orgQuery, status: 'RESOLVED' }),
      WasteReport.aggregate([
        { $match: orgQuery },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]),
      WasteReport.aggregate([
        { $match: orgQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      CollectionTask.countDocuments(orgQuery),
      CollectionTask.countDocuments({ ...orgQuery, status: 'COMPLETED' }),
      WasteReport.find(orgQuery)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('residentId', 'fullName')
        .populate('serviceZoneId', 'name'),
    ]);

    const resolutionRate = totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return sendSuccess(res, 'Municipal analytics retrieved', {
      kpis: {
        totalReports,
        submittedReports,
        inProgressReports,
        resolvedReports,
        resolutionRate,
        taskCompletionRate,
        totalTasks,
      },
      reportsByCategory: reportsByCategory.map((c) => ({
        category: c._id,
        count: c.count,
      })),
      reportsByStatus: reportsByStatus.map((s) => ({
        status: s._id,
        count: s.count,
      })),
      recentReports,
    });
  } catch (error) {
    next(error);
  }
}

export async function getResidentAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;

    const [
      totalSubmitted,
      resolvedCount,
      activeCount,
      lastLedger,
    ] = await Promise.all([
      WasteReport.countDocuments({ residentId: userId }),
      WasteReport.countDocuments({ residentId: userId, status: 'RESOLVED' }),
      WasteReport.countDocuments({ residentId: userId, status: { $nin: ['RESOLVED', 'REJECTED'] } }),
      RewardLedger.findOne({ residentId: userId }).sort({ createdAt: -1 }),
    ]);

    return sendSuccess(res, 'Resident dashboard summary retrieved', {
      totalSubmitted,
      resolvedCount,
      activeCount,
      rewardPoints: lastLedger ? lastLedger.balanceAfter : 0,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRecyclingAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const transactions = await RecyclingTransaction.find();
    let totalKg = 0;
    let totalPoints = 0;

    const categoryMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      totalPoints += tx.totalRewardPoints;
      tx.materials.forEach((m) => {
        totalKg += m.quantity;
        categoryMap[m.category] = (categoryMap[m.category] || 0) + m.quantity;
      });
    });

    return sendSuccess(res, 'Recycling analytics retrieved', {
      totalKgRecycled: Math.round(totalKg * 10) / 10,
      totalRewardPointsIssued: totalPoints,
      totalTransactions: transactions.length,
      categoryDistribution: Object.entries(categoryMap).map(([category, kg]) => ({
        category,
        quantityKg: Math.round(kg * 10) / 10,
      })),
    });
  } catch (error) {
    next(error);
  }
}
