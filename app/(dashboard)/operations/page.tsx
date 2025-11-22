'use client';

import Link from 'next/link';
import { FileText, Truck, ArrowLeftRight, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function OperationsPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Operations</h1>
          <p className="mt-2 text-gray-600">Manage all inventory operations and movements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/operations/receipts">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mt-4">Receipts</CardTitle>
                <CardDescription>
                  Incoming inventory operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Manage incoming stock from vendors and suppliers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/operations/deliveries">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="mt-4">Deliveries</CardTitle>
                <CardDescription>
                  Outgoing inventory operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Manage outbound shipments to customers
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/operations/transfers">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <ArrowLeftRight className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="mt-4">Transfers</CardTitle>
                <CardDescription>
                  Internal stock movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Move inventory between locations and warehouses
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/operations/adjustments">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-orange-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Wrench className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="mt-4">Adjustments</CardTitle>
                <CardDescription>
                  Inventory corrections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Adjust stock levels for damages, losses, or corrections
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
