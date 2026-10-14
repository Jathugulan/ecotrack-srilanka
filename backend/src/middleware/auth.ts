import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthenticatedRequest, AuthUserPayload, UserRole } from '../types/index.js';
import { sendError } from '../utils/response.js';

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.ecotrack_access_token) {
    token = req.cookies.ecotrack_access_token;
  }

  if (!token) {
    return sendError(res, 'Authentication required. No token provided.', 401, 'UNAUTHORIZED');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthUserPayload;
    req.user = decoded;
    return next();
  } catch (error) {
    return sendError(res, 'Invalid or expired access token.', 401, 'INVALID_TOKEN');
  }
}

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Unauthenticated user.', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Role '${req.user.role}' is not authorized to perform this operation.`,
        403,
        'FORBIDDEN'
      );
    }

    return next();
  };
}

export function authorizeOrganization(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return sendError(res, 'Unauthenticated user.', 401, 'UNAUTHORIZED');
  }

  // SYSTEM_ADMIN bypasses tenant isolation
  if (req.user.role === 'SYSTEM_ADMIN') {
    return next();
  }

  const requestedOrgId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
  if (requestedOrgId && req.user.organizationId && requestedOrgId.toString() !== req.user.organizationId.toString()) {
    return sendError(
      res,
      'Tenant isolation breach: You cannot access operational records outside your assigned municipal organization.',
      403,
      'CROSS_TENANT_FORBIDDEN'
    );
  }

  return next();
}
