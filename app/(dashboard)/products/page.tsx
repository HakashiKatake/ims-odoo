'use client';

import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Package, Filter, MoreHorizontal, Box } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  unitOfMeasure: string;
  perUnitCost: number;
  minStockLevel: number;
  description?: string;
  quantity?: number; // Added for display if available from API, though API might need adjustment to send this in list
}

export default function ProductsPage() {
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitOfMeasure: 'piece',
    perUnitCost: '',
    minStockLevel: '',
    description: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      
      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          perUnitCost: parseFloat(formData.perUnitCost),
          minStockLevel: parseInt(formData.minStockLevel),
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchProducts();
        // Refresh dashboard to update product count
        refreshDashboard();
        toast.success(editingProduct ? 'Product updated' : 'Product created');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      unitOfMeasure: product.unitOfMeasure,
      perUnitCost: product.perUnitCost.toString(),
      minStockLevel: product.minStockLevel.toString(),
      description: product.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Product deleted successfully');
        fetchProducts();
        // Refresh dashboard to update product count
        refreshDashboard();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      unitOfMeasure: 'piece',
      perUnitCost: '',
      minStockLevel: '',
      description: '',
    });
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-[#0B0E14]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#0B0E14] min-h-screen text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400 tracking-tight uppercase">Product List</h1>
            <p className="mt-1 text-slate-400 text-sm">Manage your stock items</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search by Name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 bg-[#151A25] border-[#2A3241] text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
              />
            </div>
            <Button variant="outline" className="bg-[#151A25] border-[#2A3241] text-slate-400 hover:text-white hover:bg-[#1C2333]">
              <Filter className="h-4 w-4" />
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-indigo-900/20">
                  <Plus className="mr-2 h-4 w-4" />
                  ADD ITEM
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#151A25] border-[#2A3241] text-white">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    {editingProduct ? 'Update product information' : 'Create a new product in your inventory'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku" className="text-slate-300">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                        required
                        className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-300">Category *</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                        className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitOfMeasure" className="text-slate-300">Unit of Measure *</Label>
                      <Input
                        id="unitOfMeasure"
                        value={formData.unitOfMeasure}
                        onChange={(e) => setFormData({ ...formData, unitOfMeasure: e.target.value })}
                        required
                        className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perUnitCost" className="text-slate-300">Cost per Unit *</Label>
                      <Input
                        id="perUnitCost"
                        type="number"
                        step="0.01"
                        value={formData.perUnitCost}
                        onChange={(e) => setFormData({ ...formData, perUnitCost: e.target.value })}
                        required
                        className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStockLevel" className="text-slate-300">Min Stock Level *</Label>
                      <Input
                        id="minStockLevel"
                        type="number"
                        value={formData.minStockLevel}
                        onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                        required
                        className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Description</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#0B0E14] border-[#2A3241] text-white focus:border-cyan-500"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} className="border-[#2A3241] text-slate-300 hover:bg-[#2A3241] hover:text-white">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      {editingProduct ? 'Update' : 'Create'} Product
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="bg-[#151A25] border-[#2A3241] shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#1C2333]">
                <TableRow className="border-[#2A3241] hover:bg-[#1C2333]">
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Product</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4">Category</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-right">Price</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-right">Quantity</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-right">Total Value</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-center">Status</TableHead>
                  <TableHead className="text-slate-400 font-bold text-xs uppercase tracking-wider py-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow className="border-[#2A3241] hover:bg-[#1C2333]">
                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center justify-center">
                        <Package className="h-12 w-12 mb-3 opacity-20" />
                        <p>No products found. Add your first product to get started.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => {
                    // Quantity is now fetched from the API
                    const quantity = product.quantity || 0; 
                    const totalValue = quantity * product.perUnitCost;
                    const isLowStock = quantity <= product.minStockLevel;

                    return (
                      <TableRow key={product._id} className="border-[#2A3241] hover:bg-[#1C2333]/50 transition-colors group">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-[#0B0E14] border border-[#2A3241] flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                              <Box className="h-5 w-5 text-cyan-500" />
                            </div>
                            <div>
                              <div className="font-bold text-white">{product.name}</div>
                              <div className="text-xs text-slate-500 font-mono">{product.sku}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="secondary" className="bg-[#1C2333] text-indigo-300 border border-indigo-500/20 hover:bg-[#1C2333]">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-slate-300 py-4">
                          ${product.perUnitCost.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <span className="font-bold text-white">{quantity}</span>
                          <span className="text-xs text-slate-500 ml-1 uppercase">{product.unitOfMeasure}</span>
                        </TableCell>
                        <TableCell className="text-right font-mono text-cyan-400 font-bold py-4">
                          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-center py-4">
                          {isLowStock ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 uppercase text-[10px] tracking-wider">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase text-[10px] tracking-wider">
                              ● OK
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-slate-500 hover:text-white hover:bg-[#2A3241]">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#151A25] border-[#2A3241] text-slate-300">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(product)} className="hover:bg-[#2A3241] hover:text-white cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-[#2A3241]" />
                              <DropdownMenuItem onClick={() => handleDelete(product._id)} className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
