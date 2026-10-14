import { Response, NextFunction } from 'express';
import { CollectionSchedule } from './schedule.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function getSchedules(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { zoneId, day } = req.query;
    const query: any = { isActive: true };

    if (zoneId) query.serviceZoneId = zoneId;
    if (day) query.collectionDays = day;

    if (req.user?.organizationId && req.user.role !== 'SYSTEM_ADMIN') {
      query.organizationId = req.user.organizationId;
    }

    const schedules = await CollectionSchedule.find(query)
      .populate('serviceZoneId', 'name district localAuthority')
      .populate('organizationId', 'name');

    return sendSuccess(res, 'Schedules retrieved', schedules);
  } catch (error) {
    next(error);
  }
}

export async function createSchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const {
      serviceZoneId,
      wasteCategories,
      collectionDays,
      startTime,
      endTime,
      effectiveFrom,
    } = req.body;

    const schedule = await CollectionSchedule.create({
      organizationId: req.user.organizationId,
      serviceZoneId,
      wasteCategories,
      collectionDays,
      startTime,
      endTime,
      effectiveFrom: effectiveFrom || new Date(),
    });

    return sendSuccess(res, 'Collection schedule created', schedule, 201);
  } catch (error) {
    next(error);
  }
}
