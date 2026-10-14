import mongoose, { Document, Schema } from 'mongoose';
import { WasteCategory } from '../../types/index.js';

export interface IRecyclingCenter extends Document {
  name: string;
  organizationId?: mongoose.Types.ObjectId;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  address: string;
  acceptedMaterials: WasteCategory[];
  openingHours: string;
  contactDetails: {
    phone: string;
    email?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecyclingCenterSchema = new Schema<IRecyclingCenter>(
  {
    name: { type: String, required: true, trim: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: { type: String, required: true },
    acceptedMaterials: [{ type: String, required: true }],
    openingHours: { type: String, required: true },
    contactDetails: {
      phone: { type: String, required: true },
      email: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

RecyclingCenterSchema.index({ location: '2dsphere' });

export const RecyclingCenter = mongoose.model<IRecyclingCenter>('RecyclingCenter', RecyclingCenterSchema);
