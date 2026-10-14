import { Response, NextFunction } from 'express';
import { AuditLog } from './auditLog.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess } from '../../utils/response.js';

export async function getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const query: any = {};
    if (req.user?.organizationId && req.user.role !== 'SYSTEM_ADMIN') {
      query.organizationId = req.user.organizationId;
    }

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(50)
      .populate('actorId', 'fullName role email');

    return sendSuccess(res, 'Audit logs retrieved', logs);
  } catch (error) {
    next(error);
  }
}
