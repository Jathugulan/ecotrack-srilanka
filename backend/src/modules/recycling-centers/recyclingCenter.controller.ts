import { Request, Response, NextFunction } from 'express';
import { RecyclingCenter } from './recyclingCenter.model.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function getRecyclingCenters(req: Request, res: Response, next: NextFunction) {
  try {
    const { material, search } = req.query;
    const query: any = { isActive: true };

    if (material) query.acceptedMaterials = material;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const centers = await RecyclingCenter.find(query);
    return sendSuccess(res, 'Recycling centers retrieved', centers);
  } catch (error) {
    next(error);
  }
}

export async function getNearbyRecyclingCenters(req: Request, res: Response, next: NextFunction) {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const maxDistance = parseInt((req.query.maxDistance as string) || '15000', 10); // 15km default

    if (isNaN(lat) || isNaN(lng)) {
      return sendError(res, 'Valid lat and lng query parameters required', 400);
    }

    const centers = await RecyclingCenter.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance,
        },
      },
    });

    return sendSuccess(res, 'Nearby recycling centers retrieved', centers);
  } catch (error) {
    next(error);
  }
}

export async function createRecyclingCenter(req: Request, res: Response, next: NextFunction) {
  try {
    const center = await RecyclingCenter.create(req.body);
    return sendSuccess(res, 'Recycling center created', center, 201);
  } catch (error) {
    next(error);
  }
}
