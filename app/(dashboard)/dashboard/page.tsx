'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Package, AlertTriangle, FileText, Truck, ArrowLeftRight, TrendingUp, Activity, BarChart3, Globe, Database, AlertOctagon, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';

interface DashboardKPIs {
  totalProductsInStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  internalTransfersScheduled: number;
}

interface AnalyticsData {
  stockOverview: {
    totalQuantity: number;
    totalValue: number;
  };
  recentActivity: {
    receipts: Array<{ _id: string; count: number; totalProducts: number }>;
    deliveries: Array<{ _id: string; count: number; totalProducts: number }>;
  };
  topProducts: Array<{
    _id: string;
    name: string;
    sku: string;
    totalQuantity: number;
    totalValue: number;
  }>;
  movementSummary: {
    receipts: number;
    deliveries: number;
    transfers: number;
    adjustments: number;
  };
  lowStockAlerts: Array<{
    _id: string;
    name: string;
    sku: string;
    totalStock: number;
    minStockLevel: number;
  }>;
}

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { dashboardStats, setDashboardStats, refreshDashboard } = useStore();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to role selection if user doesn't have a role
    if (user && !user.unsafeMetadata?.role) {
      router.push('/select-role');
      return;
    }

    fetchDashboardData();
    fetchAnalytics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const data = await response.json();
        setKpis(data.kpis);
        setDashboardStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate category data for radar chart
  const categoryData = analytics?.topProducts.reduce((acc: any[], product) => {
    const existing = acc.find(item => item.name === product.name.split(' ')[0]);
    if (existing) {
      existing.value += product.totalValue;
      existing.count += product.totalQuantity;
    } else {
      acc.push({ 
        name: product.name.split(' ')[0], 
        value: product.totalValue, 
        count: product.totalQuantity, 
        fullMark: 10000 
      });
    }
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              DASH<span className="font-bold text-cyan-400">BOARD</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Welcome back, {user?.fullName || 'User'}! Here's your inventory overview.
            </p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="inline-flex items-center gap-3 bg-indigo-900/30 px-4 py-2 rounded-full border border-indigo-500/30 backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold text-cyan-300 tracking-widest">LIVE</span>
            </div>
          </div>
        </div>

        {/* KPI Cards - 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Products in Stock */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-blue-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <Package size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-blue-200 mb-1">
                    Products in Stock
                  </span>
                  <span className="text-3xl font-bold text-white tracking-tight neon-text">
                    {kpis?.totalProductsInStock || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_currentcolor]"></div>
                Unique products available
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-yellow-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-600/20 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-yellow-900/30 border border-yellow-700 text-yellow-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-yellow-200 mb-1">
                    Low Stock Alert
                  </span>
                  <span className="text-3xl font-bold text-yellow-400 tracking-tight neon-text">
                    {kpis?.lowStockItems || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-yellow-300 font-medium tracking-wide border-t border-yellow-800/50 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_currentcolor]"></div>
                Items below minimum level
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-red-700/50">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-pink-600/20 opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <AlertOctagon size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-200 mb-1">
                    Out of Stock
                  </span>
                  <span className="text-3xl font-bold text-red-400 tracking-tight neon-text">
                    {kpis?.outOfStockItems || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-red-300 font-medium tracking-wide border-t border-red-800/50 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_5px_currentcolor]"></div>
                Products unavailable
              </div>
            </div>
          </div>

          {/* Pending Receipts */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-green-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <FileText size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-green-200 mb-1">
                    Pending Receipts
                  </span>
                  <span className="text-3xl font-bold text-white tracking-tight neon-text">
                    {kpis?.pendingReceipts || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_5px_currentcolor]"></div>
                Incoming stock operations
              </div>
            </div>
          </div>

          {/* Pending Deliveries */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-600/20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-purple-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <Truck size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-200 mb-1">
                    Pending Deliveries
                  </span>
                  <span className="text-3xl font-bold text-white tracking-tight neon-text">
                    {kpis?.pendingDeliveries || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_5px_currentcolor]"></div>
                Outgoing stock operations
              </div>
            </div>
          </div>

          {/* Internal Transfers */}
          <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-600/20 opacity-5 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative p-6 flex flex-col justify-between h-full z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <ArrowLeftRight size={24} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-200 mb-1">
                    Internal Transfers
                  </span>
                  <span className="text-3xl font-bold text-white tracking-tight neon-text">
                    {kpis?.internalTransfersScheduled || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-slate-300 font-medium tracking-wide border-t border-slate-800 pt-3 mt-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_5px_currentcolor]"></div>
                Scheduled movements
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        {analytics && (
          <>
            {/* Charts Area - Recent Activity & Movement Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity Chart */}
              <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-400" />
                    Recent Activity (Last 7 Days)
                  </h3>
                  <p className="text-xs text-cyan-300">Receipts and deliveries trend</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analytics.recentActivity.receipts.map((receipt, idx) => ({
                        date: receipt._id,
                        receipts: receipt.count,
                        deliveries: analytics.recentActivity.deliveries[idx]?.count || 0,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid #4f46e5',
                          borderRadius: '8px',
                          color: '#fff',
                          boxShadow: '0 0 15px rgba(79, 70, 229, 0.3)'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="receipts" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="deliveries" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Movement Summary Chart */}
              <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                    Movement Summary (30 Days)
                  </h3>
                  <p className="text-xs text-purple-300">Total operations by type</p>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Receipts', value: analytics.movementSummary.receipts },
                        { name: 'Deliveries', value: analytics.movementSummary.deliveries },
                        { name: 'Transfers', value: analytics.movementSummary.transfers },
                        { name: 'Adjustments', value: analytics.movementSummary.adjustments },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          border: '1px solid #4f46e5',
                          borderRadius: '8px',
                          color: '#fff',
                          boxShadow: '0 0 15px rgba(79, 70, 229, 0.3)'
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Stock Trends & Category Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Radar Chart */}
              <div className="lg:col-span-1 card p-6 relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Globe size={100} className="text-indigo-500" />
                </div>
                <div className="mb-2 relative z-10">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Top Categories</h3>
                  <p className="text-xs text-cyan-300">Distribution by Value</p>
                </div>
                <div className="h-64 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryData}>
                      <PolarGrid stroke="#3730a3" strokeDasharray="3 3" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: '#cbd5e1', fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                      <Radar name="Value" dataKey="value" stroke="#22d3ee" strokeWidth={2} fill="#22d3ee" fillOpacity={0.3} />
                      <Tooltip 
                        contentStyle={{backgroundColor: '#0f172a', border: '1px solid #3730a3', borderRadius: '8px', color: '#fff'}}
                        itemStyle={{color: '#22d3ee'}}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Stock Overview Trend */}
              <div className="lg:col-span-2 card p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">Stock Overview</h3>
                    <p className="text-xs text-purple-300">Total quantity and value</p>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div>
                      <p className="text-xs text-slate-400">Total Quantity</p>
                      <p className="text-2xl font-bold text-cyan-400">{analytics.stockOverview.totalQuantity}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Value</p>
                      <p className="text-2xl font-bold text-purple-400">${analytics.stockOverview.totalValue.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics.recentActivity.receipts.map((receipt, idx) => ({
                      date: receipt._id,
                      quantity: receipt.totalProducts,
                      operations: receipt.count + (analytics.recentActivity.deliveries[idx]?.count || 0),
                    }))}>
                      <defs>
                        <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorOps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                      <YAxis hide />
                      <Tooltip 
                        contentStyle={{backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid #4f46e5', borderRadius: '8px', color: '#fff', boxShadow: '0 0 15px rgba(79, 70, 229, 0.3)'}} 
                      />
                      <Area type="monotone" dataKey="quantity" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorQuantity)" />
                      <Area type="monotone" dataKey="operations" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorOps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Products & Low Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products by Value */}
              <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">Top Products by Value</h3>
                  <p className="text-xs text-cyan-300">Highest inventory value items</p>
                </div>
                <div className="space-y-3">
                  {analytics.topProducts.slice(0, 5).map((product, idx) => (
                    <div key={product._id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-cyan-500/50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-2xl text-slate-600">#{idx + 1}</div>
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-xs text-slate-400">{product.sku}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-green-400">
                          ${product.totalValue.toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-400">{product.totalQuantity} units</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Low Stock Alerts
                  </h3>
                  <p className="text-xs text-orange-300">Products below minimum levels</p>
                </div>
                {analytics.lowStockAlerts.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <AlertOctagon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">All products are adequately stocked!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analytics.lowStockAlerts.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex items-center justify-between p-4 bg-orange-900/20 rounded-lg border border-orange-700/50 hover:border-orange-500/50 transition-all">
                        <div>
                          <div className="font-medium text-white">{product.name}</div>
                          <div className="text-xs text-slate-400">{product.sku}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-orange-400">
                            {product.totalStock} / {product.minStockLevel}
                          </div>
                          <div className="text-xs text-orange-300">Current / Min</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Quick Actions & System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Quick Actions</h3>
              <p className="text-xs text-slate-400">Common tasks for inventory management</p>
            </div>
            <div className="grid gap-3">
              <a
                href="/operations/receipts"
                className="card p-4 flex items-center gap-4 group hover:bg-indigo-900/20 cursor-pointer text-left rounded-xl bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 transition-all"
              >
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <ArrowDownRight size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white tracking-wide">Create Receipt</h4>
                  <p className="text-xs text-slate-300 group-hover:text-emerald-300">Receive new items</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Receive Stock</Badge>
              </a>
              <a
                href="/operations/deliveries"
                className="card p-4 flex items-center gap-4 group hover:bg-indigo-900/20 cursor-pointer text-left rounded-xl bg-slate-800/50 border border-slate-700 hover:border-orange-500/50 transition-all"
              >
                <div className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/30 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                  <ArrowUpRight size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white tracking-wide">Create Delivery</h4>
                  <p className="text-xs text-slate-300 group-hover:text-orange-300">Dispatch items out</p>
                </div>
                <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Ship Stock</Badge>
              </a>
              <a
                href="/products"
                className="card p-4 flex items-center gap-4 group hover:bg-indigo-900/20 cursor-pointer text-left rounded-xl bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 transition-all"
              >
                <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/30 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                  <Database size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white tracking-wide">Manage Products</h4>
                  <p className="text-xs text-slate-300 group-hover:text-purple-300">View and edit inventory</p>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">View All</Badge>
              </a>
            </div>
          </div>

          {/* System Status */}
          <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">System Status</h3>
              <p className="text-xs text-slate-400">Current inventory health</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <span className="text-sm font-medium text-slate-300">Stock Coverage</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-bold text-green-400 uppercase tracking-wider">Good</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <span className="text-sm font-medium text-slate-300">Active Operations</span>
                <span className="text-2xl font-bold text-white">
                  {(kpis?.pendingReceipts || 0) + (kpis?.pendingDeliveries || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <span className="text-sm font-medium text-slate-300">Alerts</span>
                <Badge variant="destructive" className="text-lg px-4 py-1">
                  {(kpis?.lowStockItems || 0) + (kpis?.outOfStockItems || 0)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <span className="text-sm font-medium text-slate-300">Total Stock Value</span>
                <span className="text-xl font-bold text-cyan-400">
                  ${analytics?.stockOverview.totalValue.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
