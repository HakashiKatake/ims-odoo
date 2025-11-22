'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Settings, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Adjustment {
  _id: string;
  reference: string;
  scheduleDate: string;
  status: string;
  reason: string;
  location: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  products: Array<{
    product: {
      name: string;
    };
    quantityChange: number;
  }>;
}

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const response = await fetch('/api/adjustments');
      if (response.ok) {
        const data = await response.json();
        setAdjustments(data.adjustments);
      }
    } catch (error) {
      console.error('Error fetching adjustments:', error);
    } finally {
      setLoading(false);
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
      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.color} ${config.border} border`}>
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

  const getReasonBadge = (reason: string) => {
    const variants: Record<string, { color: string; bg: string; border: string }> = {
      damage: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50' },
      loss: { color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700/50' },
      found: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50' },
      expired: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50' },
      count_error: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/50' },
      other: { color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700' },
    };
    const config = variants[reason] || variants.other;
    return (
      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.color} ${config.border} border`}>
        {getReasonLabel(reason)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              STOCK <span className="font-bold text-cyan-400">ADJUSTMENTS</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Manage inventory adjustments for damages, losses, and corrections
            </p>
          </div>
          <Link href="/operations/adjustments/new">
            <Button className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Adjustment
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">All Adjustments</h3>
            <p className="text-xs text-slate-400">View and manage all stock adjustment operations</p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading adjustments...</p>
            </div>
          ) : adjustments.length === 0 ? (
            <div className="py-12 text-center">
              <Wrench className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-sm font-medium text-slate-400">No adjustments</h3>
              <p className="mt-2 text-sm text-slate-500">
                Get started by creating a new stock adjustment.
              </p>
              <div className="mt-6">
                <Link href="/operations/adjustments/new">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50">
                    <Plus className="mr-2 h-4 w-4" />
                    New Adjustment
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Products</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustments.map((adjustment) => (
                    <tr key={adjustment._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-medium text-cyan-400">{adjustment.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <span className="text-purple-400">{adjustment.location.warehouse.name}</span> / <span className="text-cyan-400">{adjustment.location.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getReasonBadge(adjustment.reason)}</td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{adjustment.products.length} items</span>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(adjustment.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <Link href={`/operations/adjustments/${adjustment._id}`}>
                          <Button variant="outline" size="sm" className="bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300">
                            View
                          </Button>
                        </Link>
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
