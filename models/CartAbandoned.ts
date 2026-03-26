import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartAbandonedItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  size: string;
}

export interface ICartAbandoned extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartAbandonedItem[];
  cartValue: number;
  emailSent: boolean;
  emailSentAt?: Date;
  createdAt: Date;
  recoveredAt?: Date;
}

const CartAbandonedItemSchema = new Schema<ICartAbandonedItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String, required: true },
});

const CartAbandonedSchema = new Schema<ICartAbandoned>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartAbandonedItemSchema],
    cartValue: { type: Number, required: true },
    emailSent: { type: Boolean, default: false },
    emailSentAt: { type: Date },
    recoveredAt: { type: Date },
  },
  { timestamps: true }
);

CartAbandonedSchema.index({ userId: 1 });
CartAbandonedSchema.index({ emailSent: 1 });
CartAbandonedSchema.index({ recoveredAt: 1 });

const CartAbandoned: Model<ICartAbandoned> =
  mongoose.models.CartAbandoned ||
  mongoose.model<ICartAbandoned>('CartAbandoned', CartAbandonedSchema);

export default CartAbandoned;
