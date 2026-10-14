import { Request, Response, NextFunction } from 'express';
import { ServiceZone } from './serviceZone.model.js';
import { sendSuccess } from '../../utils/response.js';

export async function getServiceZones(req: Request, res: Response, next: NextFunction) {
  try {
    const { organizationId } = req.query;
    const query: any = { isActive: true };
    if (organizationId) query.organizationId = organizationId;

    const zones = await ServiceZone.find(query).populate('organizationId', 'name district');
    return sendSuccess(res, 'Service zones retrieved', zones);
  } catch (error) {
    next(error);
  }
}

export async function createServiceZone(req: Request, res: Response, next: NextFunction) {
  try {
    const zone = await ServiceZone.create(req.body);
    return sendSuccess(res, 'Service zone created', zone, 201);
  } catch (error) {
    next(error);
  }
}
