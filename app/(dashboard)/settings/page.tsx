'use client';

import Link from 'next/link';
import { Warehouse, MapPin, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage system configuration and master data</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/settings/warehouses">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Warehouse className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="mt-4">Warehouses</CardTitle>
                <CardDescription>
                  Manage warehouse locations and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Add, edit, or remove warehouse facilities
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/locations">
            <Card className="cursor-pointer transition-all hover:shadow-lg hover:border-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="mt-4">Storage Locations</CardTitle>
                <CardDescription>
                  Manage storage locations within warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Configure aisles, shelves, and storage areas
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
