'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Eye, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { format } from 'date-fns';

interface Receipt {
  _id: string;
  reference: string;
  contact: string;
  from: string;
  to: {
    _id: string;
    name: string;
    shortCode: string;
  };
  scheduleDate: string;
  status: string;
  products: Array<{
    product: {
      name: string;
      sku: string;
    };
    quantity: number;
  }>;
  responsible: string;
  createdAt: string;
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchReceipts();
  }, [statusFilter]);

  const fetchReceipts = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/receipts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReceipts(data.receipts);
      }
    } catch (error) {
      console.error('Error fetching receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; bg: string; border: string }> = {
      draft: { color: 'text-slate-400', bg: 'bg-slate-800/50', border: 'border-slate-700' },
      waiting: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50' },
      ready: { color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700/50' },
      done: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50' },
      canceled: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50' },
    };

    const config = variants[status] || variants.draft;
    return (
      <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.color} ${config.border} border`}>
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading receipts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              RE<span className="font-bold text-cyan-400">CEIPTS</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Manage incoming stock operations
            </p>
          </div>
          <Link href="/operations/receipts/new">
            <Button className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Receipt
            </Button>
          </Link>
        </div>

        {/* Main Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          {/* Filters Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Receipt Operations</h3>
              <p className="text-xs text-slate-400">List of all receipt operations</p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Status</SelectItem>
                  <SelectItem value="draft" className="text-white">Draft</SelectItem>
                  <SelectItem value="waiting" className="text-white">Waiting</SelectItem>
                  <SelectItem value="ready" className="text-white">Ready</SelectItem>
                  <SelectItem value="done" className="text-white">Done</SelectItem>
                  <SelectItem value="canceled" className="text-white">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Destination</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Products</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {receipts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                      <p className="text-slate-500 font-medium">No receipts found</p>
                      <p className="text-slate-600 text-sm mt-1">Create your first receipt to start receiving stock.</p>
                    </td>
                  </tr>
                ) : (
                  receipts.map((receipt) => (
                    <tr key={receipt._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-cyan-400">{receipt.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{format(new Date(receipt.scheduleDate), 'MMM dd, yyyy')}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-white">{receipt.contact}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-purple-400">{receipt.to.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">{receipt.products.length} items</span>
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(receipt.status)}</td>
                      <td className="py-4 px-4 text-right">
                        <Link href={`/operations/receipts/${receipt._id}`}>
                          <Button size="sm" variant="outline" className="bg-slate-800 border-slate-700 text-cyan-400 hover:bg-slate-700 hover:text-cyan-300">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
