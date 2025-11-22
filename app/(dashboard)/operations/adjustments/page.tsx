'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Adjustment {
  _id: string;
  reference: string;
  scheduleDate: string;
  status: string;
  reason: string;
  location: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  products: Array<{
    product: {
      name: string;
    };
    quantityChange: number;
  }>;
}

export default function AdjustmentsPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const response = await fetch('/api/adjustments');
      if (response.ok) {
        const data = await response.json();
        setAdjustments(data.adjustments);
      }
    } catch (error) {
      console.error('Error fetching adjustments:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Adjustments</h1>
            <p className="mt-2 text-gray-600">Manage inventory adjustments for damages, losses, and corrections</p>
          </div>
          <Link href="/operations/adjustments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Adjustment
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Adjustments</CardTitle>
            <CardDescription>View and manage all stock adjustment operations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading adjustments...</div>
            ) : adjustments.length === 0 ? (
              <div className="py-12 text-center">
                <Settings className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No adjustments</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by creating a new stock adjustment.
                </p>
                <div className="mt-6">
                  <Link href="/operations/adjustments/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Adjustment
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adjustments.map((adjustment) => (
                    <TableRow key={adjustment._id}>
                      <TableCell className="font-medium">{adjustment.reference}</TableCell>
                      <TableCell>
                        {adjustment.location.warehouse.name} / {adjustment.location.name}
                      </TableCell>
                      <TableCell>{getReasonLabel(adjustment.reason)}</TableCell>
                      <TableCell>{adjustment.products.length} items</TableCell>
                      <TableCell>{getStatusBadge(adjustment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/operations/adjustments/${adjustment._id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
