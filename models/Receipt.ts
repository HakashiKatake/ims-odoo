import mongoose, { Schema, Document, Model } from 'mongoose';

export type OperationStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';

export interface IProductLine {
  product: mongoose.Types.ObjectId;
  quantity: number;
  receivedQuantity?: number;
}

export interface IReceipt extends Document {
  reference: string;
  contact: string;
  from: string;
  to: mongoose.Types.ObjectId;
  scheduleDate: Date;
  status: OperationStatus;
  products: IProductLine[];
  responsible: string;
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
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    receivedQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const ReceiptSchema = new Schema<IReceipt>(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: [true, 'Contact is required'],
      trim: true,
    },
    from: {
      type: String,
      required: [true, 'From location is required'],
      default: 'vendor',
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Destination location is required'],
    },
    scheduleDate: {
      type: Date,
      required: [true, 'Schedule date is required'],
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['draft', 'waiting', 'ready', 'done', 'canceled'],
      default: 'draft',
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
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Receipt: Model<IReceipt> =
  mongoose.models.Receipt || mongoose.model<IReceipt>('Receipt', ReceiptSchema);

export default Receipt;
