import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  adminId: string;
  content: string;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  adminId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

