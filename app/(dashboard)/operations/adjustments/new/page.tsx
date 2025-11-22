'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus, ArrowLeft, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  sku: string;
}

interface Location {
  _id: string;
  name: string;
  warehouse: {
    _id: string;
    name: string;
  };
}

interface ProductLine {
  product: string;
  quantityChange: number;
}

export default function NewAdjustmentPage() {
  const router = useRouter();
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    reason: '',
    responsible: '',
    notes: '',
  });

  const [productLines, setProductLines] = useState<ProductLine[]>([
    { product: '', quantityChange: 0 },
  ]);

  useEffect(() => {
    fetchProducts();
    fetchLocations();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/locations');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const addProductLine = () => {
    setProductLines([...productLines, { product: '', quantityChange: 0 }]);
  };

  const removeProductLine = (index: number) => {
    if (productLines.length > 1) {
      setProductLines(productLines.filter((_, i) => i !== index));
    }
  };

  const updateProductLine = (index: number, field: keyof ProductLine, value: any) => {
    const updated = [...productLines];
    updated[index] = { ...updated[index], [field]: value };
    setProductLines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: productLines,
        }),
      });

      if (response.ok) {
        toast.success('Adjustment created successfully');
        refreshDashboard();
        router.push('/operations/adjustments');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create adjustment');
      }
    } catch (error) {
      console.error('Error creating adjustment:', error);
      toast.error('Failed to create adjustment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <Link href="/operations/adjustments" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 w-fit">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Adjustments</span>
          </Link>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              NEW STOCK <span className="font-bold text-cyan-400">ADJUSTMENT</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Adjust inventory for damages, losses, or corrections
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Adjustment Information Card */}
          <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <Wrench className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Adjustment Information</h3>
                <p className="text-xs text-slate-400">Details about the stock adjustment</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-300">Location *</Label>
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => setFormData({ ...formData, location: value })} 
                    required
                  >
                    <SelectTrigger id="location" className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {locations.map((loc) => (
                        <SelectItem key={loc._id} value={loc._id} className="text-white">
                          {loc.warehouse.name} / {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-slate-300">Reason *</Label>
                  <Select 
                    value={formData.reason} 
                    onValueChange={(value) => setFormData({ ...formData, reason: value })} 
                    required
                  >
                    <SelectTrigger id="reason" className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="damage" className="text-white">Damage</SelectItem>
                      <SelectItem value="loss" className="text-white">Loss/Theft</SelectItem>
                      <SelectItem value="found" className="text-white">Found</SelectItem>
                      <SelectItem value="expired" className="text-white">Expired</SelectItem>
                      <SelectItem value="count_error" className="text-white">Count Error</SelectItem>
                      <SelectItem value="other" className="text-white">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible" className="text-slate-300">Responsible Person *</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-300">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details about this adjustment..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Products Card */}
          <div className="card p-6 rounded-xl bg-slate-900 border border-slate-800">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">Products</h3>
                <p className="text-xs text-slate-400">Select products and quantity changes (use negative for reductions)</p>
              </div>
              <Button 
                type="button" 
                size="sm" 
                onClick={addProductLine}
                className="bg-green-600 hover:bg-green-700 text-white border-green-500/50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <div className="space-y-4">
              {productLines.map((line, index) => (
                <div key={index} className="flex gap-4 items-end p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`product-${index}`} className="text-slate-300">
                      Product {index + 1} *
                    </Label>
                    <Select
                      value={line.product}
                      onValueChange={(value) => updateProductLine(index, 'product', value)}
                      required
                    >
                      <SelectTrigger id={`product-${index}`} className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id} className="text-white">
                            <span className="font-mono text-cyan-400">{product.sku}</span> - {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40 space-y-2">
                    <Label htmlFor={`quantity-${index}`} className="text-slate-300">Quantity Change *</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      placeholder="+10 or -5"
                      value={line.quantityChange || ''}
                      onChange={(e) => updateProductLine(index, 'quantityChange', parseInt(e.target.value) || 0)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-500/50"
                      required
                    />
                  </div>
                  {productLines.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeProductLine(index)}
                      className="bg-slate-800 border-slate-700 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {/* Tip Box */}
              <div className="rounded-lg bg-blue-900/20 border border-blue-700/30 p-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Tip:</strong> Use positive numbers (+10) to add stock, negative numbers (-5) to remove stock.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-500/50"
            >
              {loading ? 'Creating...' : 'Create Adjustment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
