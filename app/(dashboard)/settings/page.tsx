'use client';

import Link from 'next/link';
import { Warehouse, MapPin, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="py-8 bg-[#0B0E14] min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 tracking-tight uppercase">Settings</h1>
          <p className="mt-2 text-slate-400">Manage system configuration and master data</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/settings/warehouses">
            <Card className="cursor-pointer transition-all duration-300 bg-[#151A25] border-[#2A3241] hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-900/20 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-[#1C2333] border border-[#2A3241] group-hover:border-cyan-500/30 transition-colors">
                    <Warehouse className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <CardTitle className="mt-4 text-white group-hover:text-cyan-400 transition-colors">Warehouses</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage warehouse locations and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Add, edit, or remove warehouse facilities
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/settings/locations">
            <Card className="cursor-pointer transition-all duration-300 bg-[#151A25] border-[#2A3241] hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-[#1C2333] border border-[#2A3241] group-hover:border-purple-500/30 transition-colors">
                    <MapPin className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <CardTitle className="mt-4 text-white group-hover:text-purple-400 transition-colors">Storage Locations</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage storage locations within warehouses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
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
