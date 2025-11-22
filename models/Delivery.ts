import mongoose, { Schema, Document, Model } from 'mongoose';

export type OperationStatus = 'draft' | 'waiting' | 'ready' | 'done' | 'canceled';

export interface IProductLine {
  product: mongoose.Types.ObjectId;
  quantity: number;
  deliveredQuantity?: number;
}

export interface IDelivery extends Document {
  reference: string;
  contact: string;
  from: mongoose.Types.ObjectId;
  to: string;
  deliveryAddress: string;
  scheduleDate: Date;
  status: OperationStatus;
  operationType: string;
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
    deliveredQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const DeliverySchema = new Schema<IDelivery>(
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
      type: String,
      required: [true, 'Destination is required'],
      default: 'customer',
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
      trim: true,
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
    operationType: {
      type: String,
      default: 'delivery',
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

const Delivery: Model<IDelivery> =
  mongoose.models.Delivery || mongoose.model<IDelivery>('Delivery', DeliverySchema);

export default Delivery;
