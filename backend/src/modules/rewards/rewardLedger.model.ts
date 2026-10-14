import mongoose, { Document, Schema } from 'mongoose';

export interface IRewardLedger extends Document {
  residentId: mongoose.Types.ObjectId;
  transactionId?: mongoose.Types.ObjectId;
  transactionType: 'CREDIT' | 'DEBIT' | 'ADJUSTMENT';
  points: number;
  balanceAfter: number;
  description: string;
  createdAt: Date;
}

const RewardLedgerSchema = new Schema<IRewardLedger>(
  {
    residentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    transactionId: { type: Schema.Types.ObjectId, ref: 'RecyclingTransaction' },
    transactionType: {
      type: String,
      required: true,
      enum: ['CREDIT', 'DEBIT', 'ADJUSTMENT'],
      default: 'CREDIT',
    },
    points: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

RewardLedgerSchema.index({ residentId: 1, createdAt: -1 });

export const RewardLedger = mongoose.model<IRewardLedger>('RewardLedger', RewardLedgerSchema);
