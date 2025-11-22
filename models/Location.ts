import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  shortCode: string;
  warehouse: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: [true, 'Short code is required'],
      uppercase: true,
      trim: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: [true, 'Warehouse is required'],
    },
  },
  {
    timestamps: true,
  }
);

LocationSchema.index({ warehouse: 1, shortCode: 1 }, { unique: true });

const Location: Model<ILocation> =
  mongoose.models.Location || mongoose.model<ILocation>('Location', LocationSchema);

export default Location;
