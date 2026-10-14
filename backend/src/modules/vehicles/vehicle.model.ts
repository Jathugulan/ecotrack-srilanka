import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  organizationId: mongoose.Types.ObjectId;
  registrationNumber: string;
  vehicleType: 'COMPACTOR_TRUCK' | 'TRACTOR' | 'TIPPER' | 'ELECTRIC_TRICYCLE';
  capacity: number;
  capacityUnit: 'METRIC_TON' | 'CUBIC_METER';
  status: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  assignedDriverId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    registrationNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    vehicleType: {
      type: String,
      required: true,
      enum: ['COMPACTOR_TRUCK', 'TRACTOR', 'TIPPER', 'ELECTRIC_TRICYCLE'],
      default: 'COMPACTOR_TRUCK',
    },
    capacity: { type: Number, required: true },
    capacityUnit: {
      type: String,
      required: true,
      enum: ['METRIC_TON', 'CUBIC_METER'],
      default: 'METRIC_TON',
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'MAINTENANCE', 'OUT_OF_SERVICE'],
      default: 'ACTIVE',
    },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
