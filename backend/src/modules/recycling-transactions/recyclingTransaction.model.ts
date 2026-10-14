import mongoose, { Document, Schema } from 'mongoose';
import { WasteCategory } from '../../types/index.js';

export interface IRecyclingTransaction extends Document {
  idempotencyKey: string;
  residentId: mongoose.Types.ObjectId;
  recyclingCenterId: mongoose.Types.ObjectId;
  verifiedBy: mongoose.Types.ObjectId;
  materials: Array<{
    category: WasteCategory;
    subType?: string;
    quantity: number;
    quantityUnit: 'KG' | 'UNITS';
    pointsPerUnit: number;
    awardedPoints: number;
  }>;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  totalRewardPoints: number;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RecyclingTransactionSchema = new Schema<IRecyclingTransaction>(
  {
    idempotencyKey: { type: String, required: true, unique: true },
    residentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recyclingCenterId: { type: Schema.Types.ObjectId, ref: 'RecyclingCenter', required: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    materials: [
      {
        category: { type: String, required: true },
        subType: { type: String },
        quantity: { type: Number, required: true },
        quantityUnit: { type: String, default: 'KG' },
        pointsPerUnit: { type: Number, required: true },
        awardedPoints: { type: Number, required: true },
      },
    ],
    verificationStatus: {
      type: String,
      required: true,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'VERIFIED',
    },
    totalRewardPoints: { type: Number, required: true },
    verifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const RecyclingTransaction = mongoose.model<IRecyclingTransaction>(
  'RecyclingTransaction',
  RecyclingTransactionSchema
);
