import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISale extends Document {
  name: string;
  startTime: Date;
  endTime: Date;
  discountPercent: number;
  discountType: 'percent' | 'fixed';
  productIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
}

const SaleSchema = new Schema<ISale>(
  {
    name: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    discountPercent: { type: Number, required: true },
    discountType: {
      type: String,
      enum: ['percent', 'fixed'],
      required: true,
    },
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SaleSchema.index({ startTime: 1, endTime: 1 });
SaleSchema.index({ isActive: 1 });

const Sale: Model<ISale> =
  mongoose.models.Sale || mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
