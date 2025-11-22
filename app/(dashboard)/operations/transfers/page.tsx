'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, ArrowLeftRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Transfer {
  _id: string;
  reference: string;
  scheduleDate: string;
  status: string;
  from: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  to: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  products: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/transfers');
      if (response.ok) {
        const data = await response.json();
        setTransfers(data.transfers);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
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

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              TRANS<span className="font-bold text-cyan-400">FERS</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Manage internal stock transfers between locations
            </p>
          </div>
          <Link href="/operations/transfers/new">
            <Button className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Transfer
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">All Transfers</h3>
            <p className="text-xs text-slate-400">View and manage all stock transfer operations</p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading transfers...</p>
            </div>
          ) : transfers.length === 0 ? (
            <div className="py-12 text-center">
              <ArrowLeftRight className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-sm font-medium text-slate-400">No transfers</h3>
              <p className="mt-2 text-sm text-slate-500">
                Get started by creating a new internal stock transfer.
              </p>
              <div className="mt-6">
                <Link href="/operations/transfers/new">
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50">
                    <Plus className="mr-2 h-4 w-4" />
                    New Transfer
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
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">From</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">To</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Products</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.map((transfer) => (
                    <tr key={transfer._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-medium text-cyan-400">{transfer.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{format(new Date(transfer.scheduleDate), 'MMM dd, yyyy')}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <span className="text-purple-400">{transfer.from.warehouse.name}</span> / <span className="text-cyan-400">{transfer.from.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <span className="text-purple-400">{transfer.to.warehouse.name}</span> / <span className="text-cyan-400">{transfer.to.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{transfer.products.length} items</span>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(transfer.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <Link href={`/operations/transfers/${transfer._id}`}>
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

        {/* Info Panel */}
        <div className="card p-6 rounded-xl bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-700/30">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <Info className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-blue-300 uppercase tracking-wider mb-3">Transfer Feature</h3>
              <p className="text-sm text-slate-300 mb-3">
                Use transfers to move stock between locations:
              </p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Move stock between locations within the same warehouse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Transfer stock between different warehouses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Track transfer status (Draft → Waiting → Ready → Done)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">•</span>
                  <span>Validate transfers to update stock levels automatically</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
