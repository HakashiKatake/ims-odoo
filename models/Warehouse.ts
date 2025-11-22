import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWarehouse extends Document {
  name: string;
  shortCode: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

const WarehouseSchema = new Schema<IWarehouse>(
  {
    name: {
      type: String,
      required: [true, 'Warehouse name is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Warehouse: Model<IWarehouse> =
  mongoose.models.Warehouse || mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);

export default Warehouse;
