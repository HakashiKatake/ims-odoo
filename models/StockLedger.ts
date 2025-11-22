import mongoose, { Schema, Document, Model } from 'mongoose';

export type MovementType = 'receipt' | 'delivery' | 'transfer' | 'adjustment';

export interface IStockLedger extends Document {
  product: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  warehouse: mongoose.Types.ObjectId;
  quantity: number;
  onHand: number;
  freeToUse: number;
  movementType: MovementType;
  reference: string;
  documentId: mongoose.Types.ObjectId;
  date: Date;
  responsible: string;
  createdAt: Date;
}

const StockLedgerSchema = new Schema<IStockLedger>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
      index: true,
    },
    warehouse: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    onHand: {
      type: Number,
      required: true,
    },
    freeToUse: {
      type: Number,
      required: true,
    },
    movementType: {
      type: String,
      enum: ['receipt', 'delivery', 'transfer', 'adjustment'],
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    documentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    responsible: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

StockLedgerSchema.index({ product: 1, location: 1 });
StockLedgerSchema.index({ warehouse: 1, date: -1 });

const StockLedger: Model<IStockLedger> =
  mongoose.models.StockLedger || mongoose.model<IStockLedger>('StockLedger', StockLedgerSchema);

export default StockLedger;
