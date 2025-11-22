'use client';

import { useEffect, useState } from 'react';
import { Package, Search, Warehouse, Database, TrendingUp, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StockItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    category: string;
    unitOfMeasure: string;
    minStockLevel: number;
  };
  location: {
    _id: string;
    name: string;
    shortCode: string;
  };
  warehouse: {
    _id: string;
    name: string;
    shortCode: string;
  };
  onHand: number;
  freeToUse: number;
}

interface StockLocation {
  warehouse: string;
  location: string;
  onHand: number;
  freeToUse: number;
}

interface ProductStock {
  product: {
    _id: string;
    name: string;
    sku: string;
    category: string;
    minStockLevel: number;
  };
  totalOnHand: number;
  totalFreeToUse: number;
  locations: StockLocation[];
}

export default function StockPage() {
  const [stockData, setStockData] = useState<ProductStock[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('all');

  useEffect(() => {
    fetchWarehouses();
    fetchStock();
  }, [selectedWarehouse]);

  const fetchWarehouses = async () => {
    try {
      const response = await fetch('/api/warehouses');
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.warehouses);
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const fetchStock = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedWarehouse !== 'all') {
        params.append('warehouse', selectedWarehouse);
      }

      const response = await fetch(`/api/stock?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStockData(data.stock);
      }
    } catch (error) {
      console.error('Error fetching stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stockData.filter((item) =>
    item.product.name.toLowerCase().includes(search.toLowerCase()) ||
    item.product.sku.toLowerCase().includes(search.toLowerCase()) ||
    item.product.category.toLowerCase().includes(search.toLowerCase())
  );

  const getStockStatus = (onHand: number, minLevel: number) => {
    if (onHand === 0) return { label: 'Out of Stock', color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-700/50' };
    if (onHand <= minLevel) return { label: 'Low Stock', color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-700/50' };
    return { label: 'In Stock', color: 'text-green-400', bg: 'bg-green-900/20', border: 'border-green-700/50' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading stock levels...</p>
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
              STOCK <span className="font-bold text-cyan-400">LEVELS</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              View current inventory across all locations
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Products */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-blue-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <Database size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-200 mb-1">
                    Total Products
                  </span>
                  <span className="text-3xl font-bold text-white tracking-tight neon-text">
                    {stockData.length}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_currentcolor]"></div>
                Unique products tracked
              </div>
            </div>
          </div>

          {/* In Stock */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-green-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <TrendingUp size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-green-200 mb-1">
                    In Stock
                  </span>
                  <span className="text-3xl font-bold text-green-400 tracking-tight neon-text">
                    {stockData.filter((s) => s.totalOnHand > s.product.minStockLevel).length}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_currentcolor]"></div>
                Above minimum levels
              </div>
            </div>
          </div>

          {/* Low Stock */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-yellow-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700 text-yellow-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-200 mb-1">
                    Low Stock
                  </span>
                  <span className="text-3xl font-bold text-yellow-400 tracking-tight neon-text">
                    {stockData.filter((s) => s.totalOnHand > 0 && s.totalOnHand <= s.product.minStockLevel).length}
                  </span>
                </div>
              </div>
              <div className="text-xs text-yellow-300 font-medium tracking-wide border-t border-yellow-800/50 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_currentcolor]"></div>
                Needs replenishment
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-red-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-600/20 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <Package size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-200 mb-1">
                    Out of Stock
                  </span>
                  <span className="text-3xl font-bold text-red-400 tracking-tight neon-text">
                    {stockData.filter((s) => s.totalOnHand === 0).length}
                  </span>
                </div>
              </div>
              <div className="text-xs text-red-300 font-medium tracking-wide border-t border-red-800/50 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_currentcolor]"></div>
                Critical attention needed
              </div>
            </div>
          </div>
        </div>

        {/* Main Stock Table */}
        <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
          {/* Search and Filter Header */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Inventory Levels</h3>
              <p className="text-xs text-slate-400">Current stock across all locations</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-full md:w-64 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                />
              </div>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger className="w-48 bg-slate-800 border-slate-700 text-white">
                  <Warehouse className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Warehouses" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Warehouses</SelectItem>
                  {warehouses.map((wh) => (
                    <SelectItem key={wh._id} value={wh._id} className="text-white">
                      {wh.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">On Hand</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Available</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Min Level</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Locations</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <Database className="h-12 w-12 mx-auto text-slate-600 mb-3" />
                      <p className="text-slate-500 font-medium">No stock data available</p>
                      <p className="text-slate-600 text-sm mt-1">Start by receiving products.</p>
                    </td>
                  </tr>
                ) : (
                  filteredStock.map((item) => {
                    const status = getStockStatus(item.totalOnHand, item.product.minStockLevel);
                    return (
                      <tr key={item.product._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-cyan-400">{item.product.sku}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-white">{item.product.name}</span>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                            {item.product.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-lg text-white">{item.totalOnHand}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-300">{item.totalFreeToUse}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-slate-400">{item.product.minStockLevel}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold ${status.bg} ${status.color} ${status.border} border`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {item.locations.map((loc, idx) => (
                              <div key={idx} className="text-xs text-slate-500 font-mono">
                                <span className="text-purple-400">{loc.warehouse}</span> / <span className="text-cyan-400">{loc.location}</span>: <span className="font-bold text-white">{loc.onHand}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
