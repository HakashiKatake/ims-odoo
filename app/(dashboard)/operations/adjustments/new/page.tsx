'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

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
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Stock Adjustment</h1>
          <p className="mt-2 text-gray-600">Adjust inventory for damages, losses, or corrections</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Adjustment Information</CardTitle>
              <CardDescription>Details about the stock adjustment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => setFormData({ ...formData, location: value })} 
                    required
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc._id} value={loc._id}>
                          {loc.warehouse.name} / {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason *</Label>
                  <Select 
                    value={formData.reason} 
                    onValueChange={(value) => setFormData({ ...formData, reason: value })} 
                    required
                  >
                    <SelectTrigger id="reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damage">Damage</SelectItem>
                      <SelectItem value="loss">Loss/Theft</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="count_error">Count Error</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsible Person *</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details about this adjustment..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Select products and quantity changes (use negative for reductions)</CardDescription>
                </div>
                <Button type="button" size="sm" onClick={addProductLine}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {productLines.map((line, index) => (
                <div key={index} className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`product-${index}`}>Product {index + 1}</Label>
                    <Select
                      value={line.product}
                      onValueChange={(value) => updateProductLine(index, 'product', value)}
                      required
                    >
                      <SelectTrigger id={`product-${index}`}>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.sku} - {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40 space-y-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity Change</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      placeholder="+10 or -5"
                      value={line.quantityChange || ''}
                      onChange={(e) => updateProductLine(index, 'quantityChange', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  {productLines.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeProductLine(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Use positive numbers (+10) to add stock, negative numbers (-5) to remove stock.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Adjustment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
