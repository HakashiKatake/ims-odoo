'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Package, MapPin, Calendar, CheckCircle, Clock, Wrench, Info, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import Link from 'next/link';

interface Adjustment {
  _id: string;
  reference: string;
  responsible: string;
  reason: string;
  notes?: string;
  status: string;
  location: {
    _id: string;
    name: string;
    warehouse: {
      name: string;
    };
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      sku: string;
    };
    quantityChange: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdjustmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [adjustment, setAdjustment] = useState<Adjustment | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAdjustment();
  }, [params.id]);

  const fetchAdjustment = async () => {
    try {
      const response = await fetch(`/api/adjustments/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAdjustment(data.adjustment);
      }
    } catch (error) {
      console.error('Error fetching adjustment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/adjustments/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      });

      if (response.ok) {
        toast.success('Adjustment validated successfully');
        fetchAdjustment();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to validate adjustment');
      }
    } catch (error) {
      console.error('Error validating adjustment:', error);
      toast.error('Failed to validate adjustment');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkReady = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/adjustments/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' }),
      });

      if (response.ok) {
        toast.success('Adjustment marked as ready');
        fetchAdjustment();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update adjustment');
      }
    } catch (error) {
      console.error('Error updating adjustment:', error);
      toast.error('Failed to update adjustment');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; bg: string; border: string; label: string }> = {
      draft: { color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700', label: 'Draft' },
      waiting: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', label: 'Waiting' },
      ready: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/50', label: 'Ready' },
      done: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50', label: 'Done' },
      canceled: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50', label: 'Canceled' },
    };
    const config = variants[status] || variants.draft;
    return (
      <span className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-bold ${config.bg} ${config.color} ${config.border} border`}>
        {config.label}
      </span>
    );
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      damage: 'Damage',
      loss: 'Loss/Theft',
      found: 'Found',
      expired: 'Expired',
      count_error: 'Count Error',
      other: 'Other',
    };
    return labels[reason] || reason;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading adjustment...</p>
        </div>
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="text-center">
          <Wrench className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-4 text-slate-400">Adjustment not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <Link href="/operations/adjustments" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Adjustments</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-light text-white tracking-tight mb-1">
                <span className="font-mono text-cyan-400">{adjustment.reference}</span>
              </h1>
              <p className="text-sm text-indigo-200 tracking-wider uppercase">
                Adjustment details and validation
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(adjustment.status)}
              <QRCodeDisplay
                value={`ADJUSTMENT:${adjustment.reference}`}
                title={`Adjustment: ${adjustment.reference}`}
                description={`Status: ${adjustment.status} | Reason: ${getReasonLabel(adjustment.reason)}`}
                variant="icon"
              />
              {adjustment.status === 'draft' && (
                <Button 
                  onClick={handleMarkReady} 
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500/50"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Mark as Ready
                </Button>
              )}
              {adjustment.status === 'ready' && (
                <Button 
                  onClick={handleValidate} 
                  disabled={updating}
                  className="bg-green-600 hover:bg-green-700 text-white border-green-500/50"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validate Adjustment
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Adjustment Information */}
          <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <Info className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Adjustment Information</h3>
                <p className="text-xs text-slate-400">General details about the adjustment</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                <MapPin className="h-5 w-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
                  <p className="text-sm font-medium text-white mt-1">
                    <span className="text-purple-400">{adjustment.location.warehouse.name}</span> / <span className="text-cyan-400">{adjustment.location.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                <AlertCircle className="h-5 w-5 text-orange-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Reason</p>
                  <p className="text-sm font-medium text-orange-300 mt-1">{getReasonLabel(adjustment.reason)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                <Info className="h-5 w-5 text-indigo-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Responsible</p>
                  <p className="text-sm font-medium text-white mt-1">{adjustment.responsible}</p>
                </div>
              </div>

              {adjustment.notes && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                  <Info className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Notes</p>
                    <p className="text-sm text-slate-300 mt-1">{adjustment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Clock className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Timeline</h3>
                <p className="text-xs text-slate-400">Adjustment status and dates</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Created</p>
                <p className="text-sm font-mono text-white mt-1">{format(new Date(adjustment.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider">Last Updated</p>
                <p className="text-sm font-mono text-white mt-1">{format(new Date(adjustment.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Status</p>
                {getStatusBadge(adjustment.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Package className="h-5 w-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Products</h3>
                <p className="text-xs text-slate-400">{adjustment.products.length} item(s) in this adjustment</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity Change</th>
                </tr>
              </thead>
              <tbody>
                {adjustment.products.map((item, index) => (
                  <tr key={index} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-cyan-400">{item.product.sku}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-white">{item.product.name}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`text-sm font-bold ${item.quantityChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
