import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  senderId: string;
  senderRole: 'student' | 'host';
  content: string;
  createdAt: Date;
  type: 'message' | 'report';
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  senderRole: { type: String, enum: ['student', 'host'], required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['message', 'report'], default: 'message' },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

