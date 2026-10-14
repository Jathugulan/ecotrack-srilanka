import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceZone extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  district: string;
  localAuthority: string;
  boundary: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceZoneSchema = new Schema<IServiceZone>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    name: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    localAuthority: { type: String, required: true, trim: true },
    boundary: {
      type: {
        type: String,
        enum: ['Polygon'],
        required: true,
        default: 'Polygon',
      },
      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ServiceZoneSchema.index({ boundary: '2dsphere' });
ServiceZoneSchema.index({ organizationId: 1, name: 1 }, { unique: true });

export const ServiceZone = mongoose.model<IServiceZone>('ServiceZone', ServiceZoneSchema);
