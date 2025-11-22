'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
import { Package, AlertTriangle, FileText, Truck, ArrowLeftRight, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
=======
import Dashboard from '@/components/Dashboard';
import { Product, StockOperation } from '@/types/dashboard';
>>>>>>> 45a53d0 (push)

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
<<<<<<< HEAD
  const { dashboardStats, setDashboardStats, refreshDashboard } = useStore();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
=======
  const [products, setProducts] = useState<Product[]>([]);
  const [history, setHistory] = useState<StockOperation[]>([]);
>>>>>>> 45a53d0 (push)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to role selection if user doesn't have a role
    if (user && !user.unsafeMetadata?.role) {
      router.push('/select-role');
      return;
    }

<<<<<<< HEAD
    fetchDashboardData();
    fetchAnalytics();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(interval);
=======
    fetchData();
>>>>>>> 45a53d0 (push)
  }, [user, router]);

  const fetchData = async () => {
    try {
      const [stockRes, productsRes, dashboardRes] = await Promise.all([
        fetch('/api/stock'),
        fetch('/api/products?limit=1000'),
        fetch('/api/dashboard')
      ]);

      if (stockRes.ok && productsRes.ok && dashboardRes.ok) {
        const stockData = await stockRes.json();
        const productsData = await productsRes.json();
        const dashboardData = await dashboardRes.json();

        // Map products and merge with stock
        const mappedProducts: Product[] = productsData.products.map((p: any) => {
          const stockItem = stockData.stock.find((s: any) => s.product._id === p._id);
          return {
            _id: p._id,
            name: p.name,
            quantity: stockItem ? stockItem.totalOnHand : 0,
            price: p.perUnitCost,
            minLevel: p.minStockLevel || 0,
            category: p.category
          };
        });

        setProducts(mappedProducts);

        // Map history (recent activity is mostly receipts in the current dashboard API)
        const mappedHistory: StockOperation[] = dashboardData.recentActivity.map((a: any) => ({
            _id: a._id,
            type: 'receipt',
            status: a.status,
            date: a.createdAt
        }));
        setHistory(mappedHistory);
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

  return (
<<<<<<< HEAD
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back, {user?.fullName || 'User'}! Here's your inventory overview.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Products in Stock
              </CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpis?.totalProductsInStock || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Unique products available
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow border-yellow-200 bg-yellow-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Low Stock Alert
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-900">
                {kpis?.lowStockItems || 0}
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Items below minimum level
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow border-red-200 bg-red-50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-800">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900">
                {kpis?.outOfStockItems || 0}
              </div>
              <p className="text-xs text-red-700 mt-1">
                Products unavailable
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Receipts
              </CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpis?.pendingReceipts || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Incoming stock operations
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Deliveries
              </CardTitle>
              <Truck className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpis?.pendingDeliveries || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Outgoing stock operations
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Internal Transfers
              </CardTitle>
              <ArrowLeftRight className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {kpis?.internalTransfersScheduled || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Scheduled movements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Charts */}
        {analytics && (
          <>
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
              {/* Stock Movement Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Recent Activity (Last 7 Days)
                  </CardTitle>
                  <CardDescription>Receipts and deliveries trend</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={analytics.recentActivity.receipts.map((receipt, idx) => ({
                        date: receipt._id,
                        receipts: receipt.count,
                        deliveries: analytics.recentActivity.deliveries[idx]?.count || 0,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="receipts" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="deliveries" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Movement Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Movement Summary (30 Days)
                  </CardTitle>
                  <CardDescription>Total operations by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        { name: 'Receipts', value: analytics.movementSummary.receipts },
                        { name: 'Deliveries', value: analytics.movementSummary.deliveries },
                        { name: 'Transfers', value: analytics.movementSummary.transfers },
                        { name: 'Adjustments', value: analytics.movementSummary.adjustments },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Top Products & Low Stock */}
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
              {/* Top Products by Value */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Value</CardTitle>
                  <CardDescription>Highest inventory value items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topProducts.slice(0, 5).map((product, idx) => (
                      <div key={product._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="font-bold text-lg text-gray-400">#{idx + 1}</div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">
                            ${product.totalValue.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">{product.totalQuantity} units</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Low Stock Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    Low Stock Alerts
                  </CardTitle>
                  <CardDescription>Products below minimum levels</CardDescription>
                </CardHeader>
                <CardContent>
                  {analytics.lowStockAlerts.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>All products are adequately stocked!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analytics.lowStockAlerts.slice(0, 5).map((product) => (
                        <div key={product._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.sku}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-orange-600">
                              {product.totalStock} / {product.minStockLevel}
                            </div>
                            <div className="text-xs text-gray-500">Current / Min</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for inventory management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <a
                  href="/operations/receipts"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Create Receipt</span>
                  <Badge>Receive Stock</Badge>
                </a>
                <a
                  href="/operations/deliveries"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Create Delivery</span>
                  <Badge variant="secondary">Ship Stock</Badge>
                </a>
                <a
                  href="/products"
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">Manage Products</span>
                  <Badge variant="outline">View All</Badge>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Current inventory health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Stock Coverage</span>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-sm font-bold text-green-600">Good</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Operations</span>
                  <span className="text-sm font-bold">
                    {(kpis?.pendingReceipts || 0) + (kpis?.pendingDeliveries || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Alerts</span>
                  <Badge variant="destructive">
                    {(kpis?.lowStockItems || 0) + (kpis?.outOfStockItems || 0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
=======
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <Dashboard products={products} history={history} />
>>>>>>> 45a53d0 (push)
    </div>
  );
}
