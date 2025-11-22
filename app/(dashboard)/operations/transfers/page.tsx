'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Transfer {
  _id: string;
  reference: string;
  scheduleDate: string;
  status: string;
  from: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  to: {
    name: string;
    warehouse: {
      name: string;
    };
  };
  products: Array<{
    product: {
      name: string;
    };
    quantity: number;
  }>;
}

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/transfers');
      if (response.ok) {
        const data = await response.json();
        setTransfers(data.transfers);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
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

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
            <p className="mt-2 text-gray-600">Manage internal stock transfers between locations</p>
          </div>
          <Link href="/operations/transfers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transfer
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transfers</CardTitle>
            <CardDescription>View and manage all stock transfer operations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-gray-500">Loading transfers...</div>
            ) : transfers.length === 0 ? (
              <div className="py-12 text-center">
                <ArrowLeftRight className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">No transfers</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Get started by creating a new internal stock transfer.
                </p>
                <div className="mt-6">
                  <Link href="/operations/transfers/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      New Transfer
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer._id}>
                      <TableCell className="font-medium">{transfer.reference}</TableCell>
                      <TableCell>{format(new Date(transfer.scheduleDate), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        {transfer.from.warehouse.name} / {transfer.from.name}
                      </TableCell>
                      <TableCell>
                        {transfer.to.warehouse.name} / {transfer.to.name}
                      </TableCell>
                      <TableCell>{transfer.products.length} items</TableCell>
                      <TableCell>{getStatusBadge(transfer.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/operations/transfers/${transfer._id}`}>
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

        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <ArrowLeftRight className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-blue-800">Transfer Feature</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Use transfers to move stock between locations:
                </p>
                <ul className="mt-2 list-inside list-disc space-y-1">
                  <li>Move stock between locations within the same warehouse</li>
                  <li>Transfer stock between different warehouses</li>
                  <li>Track transfer status (Draft → Waiting → Ready → Done)</li>
                  <li>Validate transfers to update stock levels automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
