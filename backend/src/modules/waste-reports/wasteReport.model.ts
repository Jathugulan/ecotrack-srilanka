import mongoose, { Document, Schema } from 'mongoose';
import { WasteCategory, ReportSeverity, ReportStatus } from '../../types/index.js';

export interface IWasteReport extends Document {
  referenceNumber: string;
  residentId: mongoose.Types.ObjectId;
  organizationId?: mongoose.Types.ObjectId;
  serviceZoneId?: mongoose.Types.ObjectId;
  category: WasteCategory;
  description: string;
  severity: ReportSeverity;
  images: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  aiClassification?: {
    suggestedCategory: WasteCategory;
    confidence: number;
    requiresHumanReview: boolean;
    evaluatedAt: Date;
  };
  status: ReportStatus;
  assignedTaskId?: mongoose.Types.ObjectId;
  statusHistory: Array<{
    status: ReportStatus;
    changedBy: mongoose.Types.ObjectId;
    notes?: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

const WasteReportSchema = new Schema<IWasteReport>(
  {
    referenceNumber: { type: String, required: true, unique: true, index: true },
    residentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', index: true },
    serviceZoneId: { type: Schema.Types.ObjectId, ref: 'ServiceZone' },
    category: {
      type: String,
      required: true,
      enum: [
        'ORGANIC',
        'PAPER',
        'PLASTIC',
        'GLASS',
        'METAL',
        'E_WASTE',
        'CONSTRUCTION',
        'HAZARDOUS',
        'MIXED',
      ],
    },
    description: { type: String, required: true },
    severity: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    images: [{ type: String, required: true }],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    address: { type: String, required: true },
    aiClassification: {
      suggestedCategory: { type: String },
      confidence: { type: Number },
      requiresHumanReview: { type: Boolean, default: false },
      evaluatedAt: { type: Date },
    },
    status: {
      type: String,
      required: true,
      enum: [
        'SUBMITTED',
        'UNDER_REVIEW',
        'APPROVED',
        'ASSIGNED',
        'IN_PROGRESS',
        'RESOLVED',
        'REJECTED',
        'REVIEW_REQUESTED',
      ],
      default: 'SUBMITTED',
      index: true,
    },
    assignedTaskId: { type: Schema.Types.ObjectId, ref: 'CollectionTask' },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        notes: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

WasteReportSchema.index({ location: '2dsphere' });
WasteReportSchema.index({ organizationId: 1, status: 1, createdAt: -1 });

export const WasteReport = mongoose.model<IWasteReport>('WasteReport', WasteReportSchema);
