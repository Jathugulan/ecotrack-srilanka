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

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  organizationId?: any;
  preferredLanguage?: 'en' | 'si' | 'ta';
  profileImage?: string;
}

export interface WasteReport {
  _id: string;
  referenceNumber: string;
  residentId: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  organizationId?: {
    _id: string;
    name: string;
    district: string;
  };
  serviceZoneId?: {
    _id: string;
    name: string;
    localAuthority: string;
  };
  category: WasteCategory;
  description: string;
  severity: ReportSeverity;
  images: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address: string;
  aiClassification?: {
    suggestedCategory: WasteCategory;
    confidence: number;
    requiresHumanReview: boolean;
  };
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface CollectionTask {
  _id: string;
  reportId?: WasteReport;
  organizationId: string;
  assignedWorkerId?: any;
  assignedDriverId?: any;
  vehicleId?: {
    _id: string;
    registrationNumber: string;
    vehicleType: string;
    capacity: number;
  };
  scheduledAt: string;
  priority: ReportSeverity;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  failureReason?: string;
  completionEvidence?: string[];
  syncStatus?: 'SYNCED' | 'PENDING' | 'FAILED';
}

export interface RecyclingCenter {
  _id: string;
  name: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  address: string;
  acceptedMaterials: WasteCategory[];
  openingHours: string;
  contactDetails: {
    phone: string;
    email?: string;
  };
  isActive: boolean;
}

export interface RewardTransaction {
  _id: string;
  transactionType: 'CREDIT' | 'DEBIT';
  points: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}
