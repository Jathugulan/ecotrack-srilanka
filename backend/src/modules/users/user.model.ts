import mongoose, { Document, Schema } from 'mongoose';
import { UserRole } from '../../types/index.js';

export interface IUser extends Document {
  organizationId?: mongoose.Types.ObjectId;
  serviceZoneId?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  preferredLanguage: 'en' | 'si' | 'ta';
  profileImage?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
    serviceZoneId: { type: Schema.Types.ObjectId, ref: 'ServiceZone' },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['RESIDENT', 'MUNICIPAL_OFFICER', 'COLLECTION_WORKER', 'DRIVER', 'RECYCLING_PARTNER', 'SYSTEM_ADMIN'],
      default: 'RESIDENT',
    },
    preferredLanguage: { type: String, enum: ['en', 'si', 'ta'], default: 'en' },
    profileImage: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ organizationId: 1, role: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
