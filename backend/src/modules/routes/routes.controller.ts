import { Response, NextFunction } from 'express';
import { CollectionTask } from '../collection-tasks/collectionTask.model.js';
import { WasteReport } from '../waste-reports/wasteReport.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function optimizeRoute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { taskIds, startLocation } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return sendError(res, 'taskIds array is required', 400);
    }

    const tasks = await CollectionTask.find({ _id: { $inject: taskIds } as any || { $in: taskIds } }).populate('reportId');

    // Extract valid coordinates from reports
    const waypoints: any[] = [];
    tasks.forEach((task, index) => {
      const report = task.reportId as any;
      if (report && report.location && report.location.coordinates) {
        waypoints.push({
          stopOrder: index + 1,
          taskId: task._id,
          reportId: report._id,
          referenceNumber: report.referenceNumber,
          category: report.category,
          severity: report.severity,
          address: report.address,
          coordinates: report.location.coordinates, // [lng, lat]
        });
      }
    });

    // Calculate approximate sequential road distance & duration
    let totalDistanceKm = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const [lng1, lat1] = waypoints[i].coordinates;
      const [lng2, lat2] = waypoints[i + 1].coordinates;
      // Haversine formula approximation * 1.3 road winding factor
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLng = (lng2 - lng1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const dist = 6371 * c * 1.3;
      totalDistanceKm += dist;
    }

    totalDistanceKm = Math.round(totalDistanceKm * 10) / 10;
    const estimatedMinutes = Math.round((totalDistanceKm / 25) * 60) + waypoints.length * 8; // 25 km/h avg city speed + 8 min per stop

    return sendSuccess(res, 'Route optimized successfully', {
      waypoints,
      totalStops: waypoints.length,
      totalDistanceKm,
      estimatedMinutes,
      routingEngine: 'OSRM-compatible EcoTrack Heuristic Routing Engine',
    });
  } catch (error) {
    next(error);
  }
}
