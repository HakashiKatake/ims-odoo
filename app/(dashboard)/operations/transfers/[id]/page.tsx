'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Calendar, User, Package, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeDisplay } from '@/components/qr-code-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/lib/store';

interface Transfer {
  _id: string;
  reference: string;
  from: {
    _id: string;
    name: string;
    shortCode: string;
    warehouse: {
      name: string;
    };
  };
  to: {
    _id: string;
    name: string;
    shortCode: string;
    warehouse: {
      name: string;
    };
  };
  scheduleDate: string;
  status: string;
  responsible: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      sku: string;
    };
    quantity: number;
    transferredQuantity: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function TransferDetailPage() {
  const router = useRouter();
  const params = useParams();
  const refreshDashboard = useStore((state) => state.refreshDashboard);
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTransfer();
    }
  }, [params.id]);

  const fetchTransfer = async () => {
    try {
      const response = await fetch(`/api/transfers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setTransfer(data.transfer);
      }
    } catch (error) {
      console.error('Error fetching transfer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!transfer) return;

    try {
      const response = await fetch(`/api/transfers/${transfer._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Transfer updated successfully');
        await fetchTransfer();
        refreshDashboard();
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to update transfer`);
      }
    } catch (error) {
      console.error('Error updating transfer:', error);
      toast.error('Failed to update transfer');
    }
  };

  const handleMarkReady = () => handleStatusChange('ready');
  const handleValidate = () => {
    if (confirm('Validate this transfer? Stock will be moved from source to destination location.')) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transfer...</p>
        </div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Transfer not found</h2>
            <Button className="mt-4" onClick={() => router.push('/operations/transfers')}>
              Back to Transfers
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusBadge(transfer.status);

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
              <h1 className="text-3xl font-bold text-gray-900">{transfer.reference}</h1>
              <p className="mt-2 text-gray-600">Transfer details and validation</p>
            </div>
            <div className="flex gap-2">
              <QRCodeDisplay
                value={`TRANSFER:${transfer.reference}`}
                title={`Transfer: ${transfer.reference}`}
                description={`Status: ${transfer.status} | From: ${transfer.from?.shortCode} → To: ${transfer.to?.shortCode}`}
                variant="icon"
              />
              {transfer.status === 'waiting' && (
                <Button onClick={handleMarkReady}>
                  Mark as Ready
                </Button>
              )}
              {transfer.status === 'ready' && (
                <Button onClick={handleValidate}>
                  Validate Transfer
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Information</CardTitle>
              <CardDescription>General details about the transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Source Location</p>
                  <p className="text-sm text-gray-900">
                    {transfer.from.warehouse.name} / {transfer.from.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <ArrowLeftRight className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Destination Location</p>
                  <p className="text-sm text-gray-900">
                    {transfer.to.warehouse.name} / {transfer.to.name}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start">
                <Calendar className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Schedule Date</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(transfer.scheduleDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <User className="mr-3 h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Responsible</p>
                  <p className="text-sm text-gray-900">{transfer.responsible}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Transfer status and dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(transfer.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(transfer.updatedAt), 'MMM dd, yyyy HH:mm')}
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
              {transfer.products.length} item(s) in this transfer
            </CardDescription>
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
                {transfer.products.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{item.product.sku}</TableCell>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell className="text-right font-medium">{item.quantity}</TableCell>
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
