import mongoose, { Schema, Document, Model } from 'mongoose';

export type OperationStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';

export interface IProductLine {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ITransfer extends Document {
  reference: string;
  contact: string;
  from: mongoose.Types.ObjectId;
  to: mongoose.Types.ObjectId;
  date: Date;
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
  },
  { _id: false }
);

const TransferSchema = new Schema<ITransfer>(
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
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Source location is required'],
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Destination location is required'],
    },
    date: {
      type: Date,
      required: [true, 'Transfer date is required'],
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

const Transfer: Model<ITransfer> =
  mongoose.models.Transfer || mongoose.model<ITransfer>('Transfer', TransferSchema);

export default Transfer;
