import ActivityLog, { IActivityLog } from '@/models/ActivityLog';
import { auth } from '@clerk/nextjs/server';

interface LogActivityParams {
  action: 'create' | 'update' | 'delete' | 'validate' | 'cancel';
  entityType: 'product' | 'warehouse' | 'location' | 'receipt' | 'delivery' | 'transfer' | 'adjustment' | 'stock';
  entityId: string;
  entityReference?: string;
  description: string;
  changes?: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
  metadata?: {
    [key: string]: any;
  };
}

export async function logActivity(params: LogActivityParams) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.warn('Activity log skipped: No user ID available');
      return null;
    }

    // Get user info from Clerk (simplified - in production, fetch from Clerk API)
    const userName = userId; // You can enhance this to fetch actual user name

    const activityLog = await ActivityLog.create({
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      entityReference: params.entityReference,
      userId,
      userName,
      changes: params.changes,
      metadata: params.metadata,
      description: params.description,
    });

    return activityLog;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return null;
  }
}

export async function getActivityLogs(filters?: {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  skip?: number;
}) {
  try {
    const query: any = {};

    if (filters?.entityType) query.entityType = filters.entityType;
    if (filters?.entityId) query.entityId = filters.entityId;
    if (filters?.userId) query.userId = filters.userId;
    if (filters?.action) query.action = filters.action;
    
    if (filters?.startDate || filters?.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = filters.startDate;
      if (filters.endDate) query.createdAt.$lte = filters.endDate;
    }

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .limit(filters?.limit || 100)
      .skip(filters?.skip || 0)
      .lean();

    return logs;
  } catch (error) {
    console.error('Failed to fetch activity logs:', error);
    return [];
  }
}
