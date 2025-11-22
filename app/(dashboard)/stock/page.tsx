'use client';

import { useEffect, useState } from 'react';
import { Package, Search, Warehouse } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    if (onHand === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (onHand <= minLevel) return { label: 'Low Stock', variant: 'default' as const };
    return { label: 'In Stock', variant: 'secondary' as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stock levels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stock Levels</h1>
          <p className="mt-2 text-gray-600">View current inventory across all locations</p>
        </div>

        <div className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">In Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stockData.filter((s) => s.totalOnHand > s.product.minStockLevel).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stockData.filter((s) => s.totalOnHand > 0 && s.totalOnHand <= s.product.minStockLevel).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stockData.filter((s) => s.totalOnHand === 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Levels</CardTitle>
                <CardDescription>Current stock across all locations</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                  <SelectTrigger className="w-48">
                    <Warehouse className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="All Warehouses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Warehouses</SelectItem>
                    {warehouses.map((wh) => (
                      <SelectItem key={wh._id} value={wh._id}>
                        {wh.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>On Hand</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Min Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Locations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No stock data available. Start by receiving products.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStock.map((item) => {
                    const status = getStockStatus(item.totalOnHand, item.product.minStockLevel);
                    return (
                      <TableRow key={item.product._id}>
                        <TableCell className="font-mono text-sm">{item.product.sku}</TableCell>
                        <TableCell className="font-medium">{item.product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.product.category}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{item.totalOnHand}</TableCell>
                        <TableCell>{item.totalFreeToUse}</TableCell>
                        <TableCell>{item.product.minStockLevel}</TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {item.locations.map((loc, idx) => (
                              <div key={idx} className="text-xs text-gray-600">
                                {loc.warehouse} / {loc.location}: {loc.onHand}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
