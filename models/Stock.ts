import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStock extends Document {
  product: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  warehouse: mongoose.Types.ObjectId;
  onHand: number;
  freeToUse: number;
  updatedAt: Date;
}

const StockSchema = new Schema<IStock>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    onHand: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    freeToUse: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

StockSchema.index({ product: 1, location: 1 }, { unique: true });
StockSchema.index({ warehouse: 1 });
StockSchema.index({ product: 1, warehouse: 1 });

const Stock: Model<IStock> =
  mongoose.models.Stock || mongoose.model<IStock>('Stock', StockSchema);

export default Stock;
