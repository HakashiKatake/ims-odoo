import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  action: 'create' | 'update' | 'delete' | 'validate' | 'cancel';
  entityType: 'product' | 'warehouse' | 'location' | 'receipt' | 'delivery' | 'transfer' | 'adjustment' | 'stock';
  entityId: mongoose.Types.ObjectId;
  entityReference?: string;
  userId: string;
  userName: string;
  changes?: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    [key: string]: any;
  };
  description: string;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'validate', 'cancel'],
    required: true,
  },
  entityType: {
    type: String,
    enum: ['product', 'warehouse', 'location', 'receipt', 'delivery', 'transfer', 'adjustment', 'stock'],
    required: true,
  },
  entityId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  entityReference: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  changes: [{
    field: String,
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
  }],
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
ActivityLogSchema.index({ createdAt: -1 });
ActivityLogSchema.index({ entityType: 1, entityId: 1 });
ActivityLogSchema.index({ userId: 1 });
ActivityLogSchema.index({ action: 1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
