import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'REPORT_STATUS' | 'SCHEDULE_UPDATE' | 'TASK_ASSIGNED' | 'REWARD_EARNED' | 'SYSTEM_ALERT';
  title: string;
  message: string;
  referenceId?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      required: true,
      enum: ['REPORT_STATUS', 'SCHEDULE_UPDATE', 'TASK_ASSIGNED', 'REWARD_EARNED', 'SYSTEM_ALERT'],
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
