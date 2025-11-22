'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Filter, Download, Activity, ArrowUpRight, ArrowDownRight, RefreshCw, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StockLedgerEntry {
  _id: string;
  product: {
    name: string;
    sku: string;
  };
  location: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  movementType: string;
  quantity: number;
  reference: string;
  sourceDocument: string;
  notes?: string;
  createdAt: string;
}

export default function MoveHistoryPage() {
  const [entries, setEntries] = useState<StockLedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEntries();
  }, [movementTypeFilter]);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/stock-ledger');
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Error fetching stock ledger:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementBadge = (type: string) => {
    const variants: Record<string, { color: string; bg: string; border: string; label: string; icon: React.ReactNode }> = {
      in: { color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50', label: 'In', icon: <ArrowDownRight className="h-3 w-3" /> },
      out: { color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50', label: 'Out', icon: <ArrowUpRight className="h-3 w-3" /> },
      adjustment: { color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50', label: 'Adjustment', icon: <FileText className="h-3 w-3" /> },
      transfer: { color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-700/50', label: 'Transfer', icon: <RefreshCw className="h-3 w-3" /> },
    };
    const config = variants[type] || variants.adjustment;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${config.bg} ${config.color} ${config.border} border`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const filteredEntries = entries.filter(entry => {
    const matchesType = movementTypeFilter === 'all' || entry.movementType === movementTypeFilter;
    const matchesSearch = searchTerm === '' || 
      entry.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const entryDate = new Date(entry.createdAt);
    const matchesStartDate = !startDate || entryDate >= new Date(startDate);
    const matchesEndDate = !endDate || entryDate <= new Date(endDate);

    return matchesType && matchesSearch && matchesStartDate && matchesEndDate;
  });

  const handleExport = () => {
    // Simple CSV export
    const headers = ['Date', 'Reference', 'Product', 'SKU', 'Location', 'Type', 'Quantity', 'Notes'];
    const rows = filteredEntries.map(entry => [
      format(new Date(entry.createdAt), 'yyyy-MM-dd HH:mm'),
      entry.reference,
      entry.product.name,
      entry.product.sku,
      `${entry.location.warehouse.name}/${entry.location.name}`,
      entry.movementType,
      entry.quantity.toString(),
      entry.notes || '',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `move-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              MOVE <span className="font-bold text-cyan-400">HISTORY</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Complete audit trail of all stock movements
            </p>
          </div>
          <Button 
            onClick={handleExport} 
            className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Filter className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Filters</h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">Filter stock movement history</p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-slate-300">Search</Label>
              <Input
                id="search"
                placeholder="Product, SKU, Reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="movementType" className="text-slate-300">Movement Type</Label>
              <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
                <SelectTrigger id="movementType" className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Types</SelectItem>
                  <SelectItem value="in" className="text-white">In</SelectItem>
                  <SelectItem value="out" className="text-white">Out</SelectItem>
                  <SelectItem value="adjustment" className="text-white">Adjustment</SelectItem>
                  <SelectItem value="transfer" className="text-white">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-300">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-slate-300">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Movement History Card */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Movement History</h3>
            <p className="text-xs text-slate-400">
              Showing {filteredEntries.length} of {entries.length} movements
            </p>
          </div>

          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading history...</p>
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-600" />
              <h3 className="mt-4 text-sm font-medium text-slate-400">No movements found</h3>
              <p className="mt-2 text-sm text-slate-500">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Quantity</th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-300">
                          {format(new Date(entry.createdAt), 'MMM dd, yyyy HH:mm')}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-cyan-400">{entry.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-white">{entry.product.name}</p>
                          <p className="text-sm text-slate-500">{entry.product.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <span className="text-purple-400">{entry.location.warehouse.name}</span> / <span className="text-cyan-400">{entry.location.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">{getMovementBadge(entry.movementType)}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-mono font-bold text-lg ${entry.movementType === 'out' ? 'text-red-400' : 'text-green-400'}`}>
                          {entry.movementType === 'out' ? '-' : '+'}{entry.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-500 max-w-xs truncate block">
                          {entry.notes || '-'}
                        </span>
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
