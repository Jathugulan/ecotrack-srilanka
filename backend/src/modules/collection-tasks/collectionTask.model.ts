import mongoose, { Document, Schema } from 'mongoose';
import { TaskStatus, SyncStatus, ReportSeverity } from '../../types/index.js';

export interface ICollectionTask extends Document {
  reportId?: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  assignedWorkerId?: mongoose.Types.ObjectId;
  assignedDriverId?: mongoose.Types.ObjectId;
  vehicleId?: mongoose.Types.ObjectId;
  scheduledAt: Date;
  priority: ReportSeverity;
  status: TaskStatus;
  failureReason?: string;
  completionEvidence: string[];
  completedAt?: Date;
  syncStatus: SyncStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionTaskSchema = new Schema<ICollectionTask>(
  {
    reportId: { type: Schema.Types.ObjectId, ref: 'WasteReport' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    assignedWorkerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle' },
    scheduledAt: { type: Date, required: true },
    priority: {
      type: String,
      required: true,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      required: true,
      enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'FAILED'],
      default: 'ASSIGNED',
      index: true,
    },
    failureReason: { type: String },
    completionEvidence: [{ type: String }],
    completedAt: { type: Date },
    syncStatus: {
      type: String,
      enum: ['SYNCED', 'PENDING', 'FAILED'],
      default: 'SYNCED',
    },
  },
  { timestamps: true }
);

export const CollectionTask = mongoose.model<ICollectionTask>('CollectionTask', CollectionTaskSchema);
