'use client';

import { useEffect, useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  quantity: number;
}

export default function NewTransferPage() {
  const router = useRouter();
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    scheduleDate: new Date().toISOString().split('T')[0],
    responsible: '',
  });

  const [productLines, setProductLines] = useState<ProductLine[]>([
    { product: '', quantity: 1 },
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
    setProductLines([...productLines, { product: '', quantity: 1 }]);
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
    
    if (formData.from === formData.to) {
      toast.warning('Source and destination locations must be different');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          products: productLines,
        }),
      });

      if (response.ok) {
        toast.success('Transfer created successfully');
        refreshDashboard();
        router.push('/operations/transfers');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create transfer');
      }
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast.error('Failed to create transfer');
    } finally {
      setLoading(false);
    }
  };

  const availableToLocations = locations.filter(loc => loc._id !== formData.from);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Transfer</h1>
          <p className="mt-2 text-gray-600">Create a new internal stock transfer</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Transfer Information</CardTitle>
              <CardDescription>Basic details about the transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">Source Location *</Label>
                  <Select 
                    value={formData.from} 
                    onValueChange={(value) => setFormData({ ...formData, from: value })} 
                    required
                  >
                    <SelectTrigger id="from">
                      <SelectValue placeholder="Select source location" />
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
                  <Label htmlFor="to">Destination Location *</Label>
                  <Select 
                    value={formData.to} 
                    onValueChange={(value) => setFormData({ ...formData, to: value })} 
                    required
                    disabled={!formData.from}
                  >
                    <SelectTrigger id="to">
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableToLocations.map((loc) => (
                        <SelectItem key={loc._id} value={loc._id}>
                          {loc.warehouse.name} / {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="scheduleDate">Schedule Date *</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>Select products and quantities to transfer</CardDescription>
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
                  <div className="w-32 space-y-2">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={line.quantity}
                      onChange={(e) => updateProductLine(index, 'quantity', parseInt(e.target.value) || 1)}
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Transfer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
