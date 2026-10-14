import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  organizationType: 'MUNICIPAL_COUNCIL' | 'URBAN_COUNCIL' | 'PRADESHIYA_SABHA' | 'RECYCLING_CONSORTIUM';
  district: string;
  address: string;
  contactDetails: {
    phone: string;
    email: string;
    website?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    organizationType: {
      type: String,
      required: true,
      enum: ['MUNICIPAL_COUNCIL', 'URBAN_COUNCIL', 'PRADESHIYA_SABHA', 'RECYCLING_CONSORTIUM'],
    },
    district: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    contactDetails: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      website: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
