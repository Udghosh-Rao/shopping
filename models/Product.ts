import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex';
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: {
    size: string;
    stock: number;
  }[];
  stock: number;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  careInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['T-Shirts', 'Shoes', 'Hoodies', 'Jeans', 'Shirts', 'Jackets', 'Accessories'],
    },
    gender: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Unisex'],
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String }],
    sizes: [
      {
        size: { type: String, required: true },
        stock: { type: Number, required: true, default: 0 },
      },
    ],
    stock: { type: Number, required: true, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    careInstructions: { type: String },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, gender: 1 });
ProductSchema.index({ name: 'text', tags: 'text' });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
