import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { WasteReport } from './wasteReport.model.js';
import { ServiceZone } from '../service-zones/serviceZone.model.js';
import { AuditLog } from '../audit-logs/auditLog.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export const createReportSchema = z.object({
  category: z.enum([
    'ORGANIC',
    'PAPER',
    'PLASTIC',
    'GLASS',
    'METAL',
    'E_WASTE',
    'CONSTRUCTION',
    'HAZARDOUS',
    'MIXED',
  ]),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  address: z.string().min(3, 'Address is required'),
  latitude: z.number().min(5.9).max(9.9),
  longitude: z.number().min(79.5).max(82.0),
  images: z.array(z.string()).min(1, 'At least one photograph is required'),
  aiSuggestedCategory: z.string().optional(),
  aiConfidence: z.number().optional(),
});

function generateReference(): string {
  const dateStr = new Date().toISOString().slice(0, 7).replace('-', '');
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `ET-${dateStr}-${randomSuffix}`;
}

export async function createReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const {
      category,
      description,
      severity,
      address,
      latitude,
      longitude,
      images,
      aiSuggestedCategory,
      aiConfidence,
    } = req.body;

    // Check if coordinates fall inside an existing municipal service zone
    let serviceZone = await ServiceZone.findOne({
      boundary: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        },
      },
      isActive: true,
    });

    const report = await WasteReport.create({
      referenceNumber: generateReference(),
      residentId: req.user.userId,
      organizationId: serviceZone?.organizationId || req.user.organizationId,
      serviceZoneId: serviceZone?._id,
      category,
      description,
      severity,
      images,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      address,
      aiClassification: aiSuggestedCategory
        ? {
            suggestedCategory: aiSuggestedCategory as any,
            confidence: aiConfidence || 0.85,
            requiresHumanReview: (aiConfidence || 0.85) < 0.65,
            evaluatedAt: new Date(),
          }
        : undefined,
      status: 'SUBMITTED',
      statusHistory: [
        {
          status: 'SUBMITTED',
          changedBy: new mongoose.Types.ObjectId(req.user.userId),
          notes: 'Citizen complaint lodged via EcoTrack portal',
          timestamp: new Date(),
        },
      ],
    });

    return sendSuccess(res, 'Waste complaint submitted successfully', report, 201);
  } catch (error) {
    next(error);
  }
}

export async function getReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const {
      status,
      category,
      severity,
      search,
      page = '1',
      limit = '20',
    } = req.query;

    const query: any = {};

    // Enforce role-based tenant scoping
    if (req.user.role === 'RESIDENT') {
      query.residentId = req.user.userId;
    } else if (
      req.user.role === 'MUNICIPAL_OFFICER' ||
      req.user.role === 'COLLECTION_WORKER' ||
      req.user.role === 'DRIVER'
    ) {
      if (req.user.organizationId) {
        query.organizationId = req.user.organizationId;
      }
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [reports, total] = await Promise.all([
      WasteReport.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('residentId', 'fullName email phone')
        .populate('organizationId', 'name district')
        .populate('serviceZoneId', 'name localAuthority'),
      WasteReport.countDocuments(query),
    ]);

    return sendSuccess(res, 'Reports retrieved', reports, 200, {
      page: pageNum,
      limit: limitNum,
      totalRecords: total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
}

export async function getReportById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const report = await WasteReport.findById(req.params.id)
      .populate('residentId', 'fullName email phone')
      .populate('organizationId', 'name district')
      .populate('serviceZoneId', 'name localAuthority')
      .populate('assignedTaskId')
      .populate('statusHistory.changedBy', 'fullName role');

    if (!report) {
      return sendError(res, 'Waste report not found', 404);
    }

    // Authorization check
    if (req.user.role === 'RESIDENT' && report.residentId._id.toString() !== req.user.userId) {
      return sendError(res, 'Access denied: You can only view your own complaints', 403);
    }

    if (
      (req.user.role === 'MUNICIPAL_OFFICER' || req.user.role === 'COLLECTION_WORKER') &&
      req.user.organizationId &&
      report.organizationId &&
      (report.organizationId as any)._id.toString() !== req.user.organizationId
    ) {
      return sendError(res, 'Access denied: Report belongs to a different municipal organization', 403);
    }

    return sendSuccess(res, 'Report details retrieved', report);
  } catch (error) {
    next(error);
  }
}

export async function updateReportStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { status, notes } = req.body;
    const report = await WasteReport.findById(req.params.id);
    if (!report) return sendError(res, 'Report not found', 404);

    const prevStatus = report.status;
    report.status = status;
    if (status === 'RESOLVED') {
      report.resolvedAt = new Date();
    }

    report.statusHistory.push({
      status,
      changedBy: new mongoose.Types.ObjectId(req.user.userId),
      notes: notes || `Status changed from ${prevStatus} to ${status}`,
      timestamp: new Date(),
    });

    await report.save();

    await AuditLog.create({
      actorId: req.user.userId,
      organizationId: report.organizationId,
      action: 'UPDATE_REPORT_STATUS',
      resourceType: 'WasteReport',
      resourceId: report.referenceNumber,
      metadata: { from: prevStatus, to: status, notes },
      timestamp: new Date(),
    });

    return sendSuccess(res, `Report status updated to ${status}`, report);
  } catch (error) {
    next(error);
  }
}

export async function requestReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { notes } = req.body;
    const report = await WasteReport.findById(req.params.id);
    if (!report) return sendError(res, 'Report not found', 404);

    if (report.residentId.toString() !== req.user.userId) {
      return sendError(res, 'You can only request reviews on your own reports', 403);
    }

    report.status = 'REVIEW_REQUESTED';
    report.statusHistory.push({
      status: 'REVIEW_REQUESTED',
      changedBy: new mongoose.Types.ObjectId(req.user.userId),
      notes: notes || 'Citizen escalated: Waste not cleared at location',
      timestamp: new Date(),
    });

    await report.save();
    return sendSuccess(res, 'Review requested successfully', report);
  } catch (error) {
    next(error);
  }
}

export async function getNearbyReports(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);
    const maxDistance = parseInt((req.query.maxDistance as string) || '5000', 10); // meters

    if (isNaN(lat) || isNaN(lng)) {
      return sendError(res, 'Valid lat and lng query parameters required', 400);
    }

    const reports = await WasteReport.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistance,
        },
      },
    }).limit(50);

    return sendSuccess(res, 'Nearby waste reports retrieved', reports);
  } catch (error) {
    next(error);
  }
}
