'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Calendar, User, Settings, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

interface Adjustment {
  _id: string;
  reference: string;
  location: {
    _id: string;
    name: string;
    shortCode: string;
    warehouse: {
      name: string;
    };
  };
  reason: string;
  status: string;
  responsible: string;
  notes?: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      sku: string;
    };
    quantityChange: number;
    adjustedQuantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function AdjustmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [adjustment, setAdjustment] = useState<Adjustment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchAdjustment();
    }
  }, [params.id]);

  const fetchAdjustment = async () => {
    try {
      const response = await fetch(`/api/adjustments/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setAdjustment(data.adjustment);
      }
    } catch (error) {
      console.error('Error fetching adjustment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!adjustment) return;

    try {
      const response = await fetch(`/api/adjustments/${adjustment._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Adjustment updated successfully');
        await fetchAdjustment();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to update adjustment`);
      }
    } catch (error) {
      console.error('Error updating adjustment:', error);
      toast.error('Failed to update adjustment');
    }
  };

  const handleMarkReady = () => handleStatusChange('ready');
  const handleValidate = () => {
    if (confirm('Validate this adjustment? Stock levels will be updated immediately.')) {
      handleStatusChange('done');
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
    return variants[status] || variants.draft;
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      damage: 'Damage',
      loss: 'Loss/Theft',
      found: 'Found',
      expired: 'Expired',
      count_error: 'Count Error',
      other: 'Other',
    };
    return labels[reason] || reason;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading adjustment...</p>
        </div>
      </div>
    );
  }

  if (!adjustment) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Adjustment not found</h2>
            <Button className="mt-4" onClick={() => router.push('/operations/adjustments')}>
              Back to Adjustments
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusBadge(adjustment.status);

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{adjustment.reference}</h1>
              <p className="mt-2 text-gray-600">Adjustment details and validation</p>
            </div>
            <div className="flex gap-2">
              <QRCodeDisplay
                value={`ADJUSTMENT:${adjustment.reference}`}
                title={`Adjustment: ${adjustment.reference}`}
                description={`Status: ${adjustment.status} | Reason: ${adjustment.reason} | Location: ${adjustment.location?.shortCode}`}
                variant="icon"
              />
              {adjustment.status === 'waiting' && (
                <Button onClick={handleMarkReady}>
                  Mark as Ready
                </Button>
              )}
              {adjustment.status === 'ready' && (
                <Button onClick={handleValidate}>
                  Validate Adjustment
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Information</CardTitle>
              <CardDescription>General details about the adjustment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-sm text-gray-900">
                    {adjustment.location.warehouse.name} / {adjustment.location.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <AlertTriangle className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p className="text-sm text-gray-900">{getReasonLabel(adjustment.reason)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start">
                <User className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Responsible</p>
                  <p className="text-sm text-gray-900">{adjustment.responsible}</p>
                </div>
              </div>

              {adjustment.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-900">{adjustment.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Adjustment status and dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(adjustment.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(adjustment.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={statusConfig.variant} className="mt-1">
                  {statusConfig.label}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              {adjustment.products.length} item(s) in this adjustment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Quantity Change</TableHead>
                  <TableHead className="text-right">Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustment.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{item.product.sku}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={item.quantityChange > 0 ? 'text-green-600' : 'text-red-600'}>
                        {item.quantityChange > 0 ? '+' : ''}{item.quantityChange}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.quantityChange > 0 ? 'default' : 'destructive'}>
                        {item.quantityChange > 0 ? 'Addition' : 'Reduction'}
                      </Badge>
                    </TableCell>
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
