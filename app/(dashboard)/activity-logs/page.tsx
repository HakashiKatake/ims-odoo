'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Activity, Filter, Calendar, User, FileText, Package, Warehouse, MapPin, TrendingUp } from 'lucide-react';
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
    const variants: Record<string, { color: string; bg: string; border: string; label: string }> = {
      create: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/50', label: 'Created' },
      update: { color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-700/50', label: 'Updated' },
      delete: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50', label: 'Deleted' },
      validate: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50', label: 'Validated' },
      cancel: { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700/50', label: 'Cancelled' },
    };

    const config = variants[action] || { color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700', label: action };
    return (
      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.color} ${config.border} border`}>
        {config.label}
      </span>
    );
  };

  const getEntityIcon = (entityType: string) => {
    const icons: Record<string, React.ReactNode> = {
      product: <Package className="h-4 w-4 text-cyan-400" />,
      warehouse: <Warehouse className="h-4 w-4 text-purple-400" />,
      location: <MapPin className="h-4 w-4 text-green-400" />,
      receipt: <TrendingUp className="h-4 w-4 text-blue-400" />,
      delivery: <TrendingUp className="h-4 w-4 rotate-180 text-orange-400" />,
      transfer: <Activity className="h-4 w-4 text-indigo-400" />,
      adjustment: <FileText className="h-4 w-4 text-yellow-400" />,
      stock: <Package className="h-4 w-4 text-slate-400" />,
    };
    return icons[entityType] || <FileText className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-8 w-8 text-cyan-400" />
              <h1 className="text-4xl font-light text-white tracking-tight">
                ACTIVITY <span className="font-bold text-cyan-400">LOG</span>
              </h1>
            </div>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Complete audit trail of all system activities
            </p>
          </div>
        </div>

        {/* Filters Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Filters</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">Filter activity logs by type and action</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">Entity Type</label>
              <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="product" className="text-white">Products</SelectItem>
                  <SelectItem value="warehouse" className="text-white">Warehouses</SelectItem>
                  <SelectItem value="location" className="text-white">Locations</SelectItem>
                  <SelectItem value="receipt" className="text-white">Receipts</SelectItem>
                  <SelectItem value="delivery" className="text-white">Deliveries</SelectItem>
                  <SelectItem value="transfer" className="text-white">Transfers</SelectItem>
                  <SelectItem value="adjustment" className="text-white">Adjustments</SelectItem>
                  <SelectItem value="stock" className="text-white">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-slate-300">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Actions</SelectItem>
                  <SelectItem value="create" className="text-white">Created</SelectItem>
                  <SelectItem value="update" className="text-white">Updated</SelectItem>
                  <SelectItem value="delete" className="text-white">Deleted</SelectItem>
                  <SelectItem value="validate" className="text-white">Validated</SelectItem>
                  <SelectItem value="cancel" className="text-white">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={fetchLogs} 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Activity History Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Activity History</h3>
            <p className="text-xs text-slate-400">
              {logs.length} {logs.length === 1 ? 'activity' : 'activities'} found
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading activity logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-sm font-medium text-slate-400">No activities found</h3>
              <p className="mt-2 text-sm text-slate-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-xs text-slate-400">
                          {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getEntityIcon(log.entityType)}
                          <span className="text-sm capitalize text-slate-300">{log.entityType}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getActionBadge(log.action)}</td>
                      <td className="py-4 px-4 max-w-md">
                        <p className="text-sm text-white">{log.description}</p>
                        {log.changes && log.changes.length > 0 && (
                          <div className="mt-2 space-y-1 text-xs text-slate-500">
                            {log.changes.slice(0, 2).map((change, idx) => (
                              <div key={idx} className="font-mono">
                                <span className="font-medium text-purple-400">{change.field}:</span>{' '}
                                <span className="text-red-400">{JSON.stringify(change.oldValue)}</span> → <span className="text-green-400">{JSON.stringify(change.newValue)}</span>
                              </div>
                            ))}
                            {log.changes.length > 2 && (
                              <span className="text-cyan-400">+{log.changes.length - 2} more changes</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {log.entityReference && (
                          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-mono text-xs">
                            {log.entityReference}
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-300">{log.userName}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
