import { Response, NextFunction } from 'express';
import { Vehicle } from './vehicle.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function getVehicles(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const query: any = {};
    if (req.user?.organizationId && req.user.role !== 'SYSTEM_ADMIN') {
      query.organizationId = req.user.organizationId;
    }

    const vehicles = await Vehicle.find(query).populate('assignedDriverId', 'fullName phone');
    return sendSuccess(res, 'Vehicles retrieved', vehicles);
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const vehicle = await Vehicle.create({
      ...req.body,
      organizationId: req.user.organizationId || req.body.organizationId,
    });
    return sendSuccess(res, 'Vehicle registered', vehicle, 201);
  } catch (error) {
    next(error);
  }
}
