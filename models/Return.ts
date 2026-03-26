import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReturn extends Document {
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  adminNotes: string;
  refundAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnSchema = new Schema<IReturn>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    adminNotes: { type: String },
    refundAmount: { type: Number, required: true },
  },
  { timestamps: true }
);

ReturnSchema.index({ orderId: 1 });
ReturnSchema.index({ userId: 1 });
ReturnSchema.index({ status: 1 });

const Return: Model<IReturn> =
  mongoose.models.Return || mongoose.model<IReturn>('Return', ReturnSchema);

export default Return;
