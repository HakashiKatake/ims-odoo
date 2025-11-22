import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdjustment extends Document {
  reference: string;
  product: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  recordedQuantity: number;
  countedQuantity: number;
  difference: number;
  reason: string;
  responsible: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdjustmentSchema = new Schema<IAdjustment>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product is required'],
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Location is required'],
    },
    recordedQuantity: {
      type: Number,
      required: [true, 'Recorded quantity is required'],
    },
    countedQuantity: {
      type: Number,
      required: [true, 'Counted quantity is required'],
      min: 0,
    },
    difference: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true,
    },
    responsible: {
      type: String,
      required: true,
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
