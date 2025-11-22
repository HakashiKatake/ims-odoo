'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Activity, Filter, Calendar, User, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ActivityLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  entityReference?: string;
  userId: string;
  userName: string;
  description: string;
  createdAt: string;
  changes?: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (entityTypeFilter !== 'all') params.set('entityType', entityTypeFilter);
      if (actionFilter !== 'all') params.set('action', actionFilter);
      params.set('limit', '100');

      const response = await fetch(`/api/activity-logs?${params}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityTypeFilter, actionFilter]);

  const getActionBadge = (action: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      create: { variant: 'default', label: 'Created' },
      update: { variant: 'secondary', label: 'Updated' },
      delete: { variant: 'destructive', label: 'Deleted' },
      validate: { variant: 'outline', label: 'Validated' },
      cancel: { variant: 'outline', label: 'Cancelled' },
    };

    const config = variants[action] || { variant: 'outline' as const, label: action };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, React.ReactNode> = {
      product: '📦',
      warehouse: '🏢',
      location: '📍',
      receipt: '📥',
      delivery: '📤',
      transfer: '🔄',
      adjustment: '⚙️',
      stock: '📊',
    };
    return icons[entityType] || '📄';
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          </div>
          <p className="text-gray-600">Complete audit trail of all system activities</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter activity logs by type and action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Entity Type</label>
                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="warehouse">Warehouses</SelectItem>
                    <SelectItem value="location">Locations</SelectItem>
                    <SelectItem value="receipt">Receipts</SelectItem>
                    <SelectItem value="delivery">Deliveries</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                    <SelectItem value="adjustment">Adjustments</SelectItem>
                    <SelectItem value="stock">Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Action</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Created</SelectItem>
                    <SelectItem value="update">Updated</SelectItem>
                    <SelectItem value="delete">Deleted</SelectItem>
                    <SelectItem value="validate">Validated</SelectItem>
                    <SelectItem value="cancel">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={fetchLogs} variant="outline" className="w-full">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>
              {logs.length} {logs.length === 1 ? 'activity' : 'activities'} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading activity logs...</div>
            ) : logs.length === 0 ? (
              <div className="py-12 text-center">
                <Activity className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No activities found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log._id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getEntityIcon(log.entityType)}</span>
                          <span className="text-sm capitalize">{log.entityType}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm text-gray-700">{log.description}</p>
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            {log.changes.slice(0, 2).map((change, idx) => (
                              <div key={idx}>
                                <span className="font-medium">{change.field}:</span>{' '}
                                {JSON.stringify(change.oldValue)} → {JSON.stringify(change.newValue)}
                              </div>
                            ))}
                            {log.changes.length > 2 && (
                              <span className="text-blue-600">+{log.changes.length - 2} more changes</span>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.entityReference && (
                          <Badge variant="outline" className="font-mono text-xs">
                            {log.entityReference}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {log.userName}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
