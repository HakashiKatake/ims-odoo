import mongoose, { Schema, Document, Model } from 'mongoose';

export type OperationStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';
export type AdjustmentReason = 'damage' | 'loss' | 'found' | 'expired' | 'count_error' | 'other';

export interface IProductLine {
  product: mongoose.Types.ObjectId;
  quantityChange: number; // positive for additions, negative for reductions
  adjustedQuantity?: number;
}

export interface IAdjustment extends Document {
  reference: string;
  location: mongoose.Types.ObjectId;
  reason: AdjustmentReason | string;
  status: OperationStatus;
  operationType: string;
  products: IProductLine[];
  responsible: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductLineSchema = new Schema<IProductLine>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    adjustedQuantity: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const AdjustmentSchema = new Schema<IAdjustment>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Location is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      enum: ['damage', 'loss', 'found', 'expired', 'count_error', 'other'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['draft', 'waiting', 'ready', 'done', 'canceled'],
      default: 'draft',
    },
    operationType: {
      type: String,
      default: 'adjustment',
    },
    products: {
      type: [ProductLineSchema],
      required: true,
      validate: {
        validator: (v: IProductLine[]) => v.length > 0,
        message: 'At least one product is required',
      },
    },
    responsible: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
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

const Adjustment: Model<IAdjustment> =
  mongoose.models.Adjustment || mongoose.model<IAdjustment>('Adjustment', AdjustmentSchema);

export default Adjustment;
