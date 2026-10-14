import { Request } from 'express';

export type UserRole =
  | 'RESIDENT'
  | 'MUNICIPAL_OFFICER'
  | 'COLLECTION_WORKER'
  | 'DRIVER'
  | 'RECYCLING_PARTNER'
  | 'SYSTEM_ADMIN';

export type WasteCategory =
  | 'ORGANIC'
  | 'PAPER'
  | 'PLASTIC'
  | 'GLASS'
  | 'METAL'
  | 'E_WASTE'
  | 'CONSTRUCTION'
  | 'HAZARDOUS'
  | 'MIXED';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED'
  | 'REVIEW_REQUESTED';

export type TaskStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export type SyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';

export interface AuthUserPayload {
  userId: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  preferredLanguage: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
