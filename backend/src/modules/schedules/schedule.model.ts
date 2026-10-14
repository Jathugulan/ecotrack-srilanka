import mongoose, { Document, Schema } from 'mongoose';
import { WasteCategory } from '../../types/index.js';

export interface ICollectionSchedule extends Document {
  organizationId: mongoose.Types.ObjectId;
  serviceZoneId: mongoose.Types.ObjectId;
  wasteCategories: WasteCategory[];
  collectionDays: ('MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY')[];
  startTime: string; // "07:00"
  endTime: string;   // "11:00"
  effectiveFrom: Date;
  effectiveUntil?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionScheduleSchema = new Schema<ICollectionSchedule>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    serviceZoneId: { type: Schema.Types.ObjectId, ref: 'ServiceZone', required: true, index: true },
    wasteCategories: [{ type: String, required: true }],
    collectionDays: [{
      type: String,
      required: true,
      enum: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    effectiveFrom: { type: Date, default: Date.now },
    effectiveUntil: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CollectionSchedule = mongoose.model<ICollectionSchedule>('CollectionSchedule', CollectionScheduleSchema);
