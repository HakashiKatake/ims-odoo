import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  perUnitCost: number;
  description?: string;
  minStockLevel?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    unitOfMeasure: {
      type: String,
      required: [true, 'Unit of measure is required'],
      trim: true,
      default: 'unit',
    },
    perUnitCost: {
      type: Number,
      required: [true, 'Per unit cost is required'],
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    minStockLevel: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', sku: 'text' });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
