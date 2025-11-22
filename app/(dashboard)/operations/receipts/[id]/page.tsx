'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Package, MapPin, User, Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore } from '@/lib/store';

interface Receipt {
  _id: string;
  reference: string;
  contact: string;
  responsible: string;
  scheduleDate: string;
  status: string;
  to: {
    _id: string;
    name: string;
    warehouse: {
      name: string;
    };
  };
  products: Array<{
    product: {
      _id: string;
      name: string;
      sku: string;
    };
    quantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function ReceiptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchReceipt();
  }, [params.id]);

  const fetchReceipt = async () => {
    try {
      const response = await fetch(`/api/receipts/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReceipt(data.receipt);
      }
    } catch (error) {
      console.error('Error fetching receipt:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/receipts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' }),
      });

      if (response.ok) {
        fetchReceipt();
        refreshDashboard();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to validate receipt');
      }
    } catch (error) {
      console.error('Error validating receipt:', error);
      alert('Failed to validate receipt');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkReady = async () => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/receipts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready' }),
      });

      if (response.ok) {
        fetchReceipt();
        refreshDashboard();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update receipt');
      }
    } catch (error) {
      console.error('Error updating receipt:', error);
      alert('Failed to update receipt');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      draft: { variant: 'secondary', label: 'Draft' },
      waiting: { variant: 'outline', label: 'Waiting' },
      ready: { variant: 'default', label: 'Ready' },
      done: { variant: 'default', label: 'Done' },
      canceled: { variant: 'destructive', label: 'Canceled' },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Loading receipt...</p>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Receipt not found</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{receipt.reference}</h1>
              <p className="mt-2 text-gray-600">Receipt details and validation</p>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(receipt.status)}
              {receipt.status === 'draft' && (
                <Button onClick={handleMarkReady} disabled={updating}>
                  <Clock className="mr-2 h-4 w-4" />
                  Mark as Ready
                </Button>
              )}
              {receipt.status === 'ready' && (
                <Button onClick={handleValidate} disabled={updating}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Validate Receipt
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Information</CardTitle>
              <CardDescription>General details about the receipt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contact</p>
                  <p className="font-medium">{receipt.contact}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">
                    {receipt.to.warehouse.name} / {receipt.to.name}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Schedule Date</p>
                  <p className="font-medium">{format(new Date(receipt.scheduleDate), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Responsible</p>
                  <p className="font-medium">{receipt.responsible}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Receipt status and dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium">{format(new Date(receipt.createdAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="font-medium">{format(new Date(receipt.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <div className="mt-1">{getStatusBadge(receipt.status)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Products</CardTitle>
                <CardDescription>{receipt.products.length} item(s) in this receipt</CardDescription>
              </div>
              <Package className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {receipt.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono">{item.product.sku}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
