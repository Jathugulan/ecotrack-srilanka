import { Response, NextFunction } from 'express';
import { CollectionTask } from './collectionTask.model.js';
import { WasteReport } from '../waste-reports/wasteReport.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status, workerId, driverId } = req.query;
    const query: any = {};

    if (req.user?.organizationId && req.user.role !== 'SYSTEM_ADMIN') {
      query.organizationId = req.user.organizationId;
    }

    if (status) query.status = status;
    if (workerId) query.assignedWorkerId = workerId;
    if (driverId) query.assignedDriverId = driverId;

    const tasks = await CollectionTask.find(query)
      .sort({ scheduledAt: 1 })
      .populate('reportId')
      .populate('assignedWorkerId', 'fullName phone')
      .populate('assignedDriverId', 'fullName phone')
      .populate('vehicleId', 'registrationNumber vehicleType capacity');

    return sendSuccess(res, 'Tasks retrieved', tasks);
  } catch (error) {
    next(error);
  }
}

export async function getMyTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const query: any = {
      $or: [
        { assignedWorkerId: req.user.userId },
        { assignedDriverId: req.user.userId },
      ],
    };

    const tasks = await CollectionTask.find(query)
      .sort({ scheduledAt: 1 })
      .populate('reportId')
      .populate('vehicleId');

    return sendSuccess(res, 'Assigned tasks retrieved', tasks);
  } catch (error) {
    next(error);
  }
}

export async function createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const {
      reportId,
      assignedWorkerId,
      assignedDriverId,
      vehicleId,
      scheduledAt,
      priority,
    } = req.body;

    const task = await CollectionTask.create({
      reportId,
      organizationId: req.user.organizationId,
      assignedWorkerId,
      assignedDriverId,
      vehicleId,
      scheduledAt: scheduledAt || new Date(),
      priority: priority || 'MEDIUM',
      status: 'ASSIGNED',
    });

    if (reportId) {
      await WasteReport.findByIdAndUpdate(reportId, {
        status: 'ASSIGNED',
        assignedTaskId: task._id,
        $push: {
          statusHistory: {
            status: 'ASSIGNED',
            changedBy: req.user.userId,
            notes: 'Collection task created and crew assigned',
            timestamp: new Date(),
          },
        },
      });
    }

    return sendSuccess(res, 'Collection task created', task, 201);
  } catch (error) {
    next(error);
  }
}

export async function updateTaskStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status, failureReason } = req.body;
    const task = await CollectionTask.findById(req.params.id);
    if (!task) return sendError(res, 'Task not found', 404);

    task.status = status;
    if (failureReason) task.failureReason = failureReason;
    if (status === 'COMPLETED') task.completedAt = new Date();

    await task.save();

    if (task.reportId) {
      const reportStatus = status === 'COMPLETED' ? 'RESOLVED' : status === 'FAILED' ? 'UNDER_REVIEW' : 'IN_PROGRESS';
      await WasteReport.findByIdAndUpdate(task.reportId, {
        status: reportStatus,
        resolvedAt: status === 'COMPLETED' ? new Date() : undefined,
        $push: {
          statusHistory: {
            status: reportStatus,
            changedBy: req.user?.userId,
            notes: `Field task updated to ${status}${failureReason ? `: ${failureReason}` : ''}`,
            timestamp: new Date(),
          },
        },
      });
    }

    return sendSuccess(res, `Task status updated to ${status}`, task);
  } catch (error) {
    next(error);
  }
}

export async function submitEvidence(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { images } = req.body;
    const task = await CollectionTask.findById(req.params.id);
    if (!task) return sendError(res, 'Task not found', 404);

    task.completionEvidence = images || [];
    task.status = 'COMPLETED';
    task.completedAt = new Date();
    await task.save();

    if (task.reportId) {
      await WasteReport.findByIdAndUpdate(task.reportId, {
        status: 'RESOLVED',
        resolvedAt: new Date(),
        $push: {
          statusHistory: {
            status: 'RESOLVED',
            changedBy: req.user?.userId,
            notes: 'Waste collection completed with photo evidence verified',
            timestamp: new Date(),
          },
        },
      });
    }

    return sendSuccess(res, 'Collection evidence recorded and task completed', task);
  } catch (error) {
    next(error);
  }
}

export async function syncOfflineTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { updates } = req.body; // array of { taskId, status, evidence, failureReason, idempotencyKey }
    if (!Array.isArray(updates)) {
      return sendError(res, 'Invalid sync payload. Array expected.', 400);
    }

    let syncedCount = 0;
    for (const item of updates) {
      const task = await CollectionTask.findById(item.taskId);
      if (task) {
        task.status = item.status;
        if (item.evidence) task.completionEvidence = item.evidence;
        if (item.failureReason) task.failureReason = item.failureReason;
        if (item.status === 'COMPLETED') task.completedAt = new Date();
        task.syncStatus = 'SYNCED';
        await task.save();

        if (task.reportId && item.status === 'COMPLETED') {
          await WasteReport.findByIdAndUpdate(task.reportId, {
            status: 'RESOLVED',
            resolvedAt: new Date(),
          });
        }
        syncedCount++;
      }
    }

    return sendSuccess(res, 'Offline tasks synchronized successfully', {
      syncedCount,
      totalReceived: updates.length,
    });
  } catch (error) {
    next(error);
  }
}
