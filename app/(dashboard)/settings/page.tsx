'use client';

import Link from 'next/link';
import { Warehouse, MapPin, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <h1 className="text-4xl font-light text-white tracking-tight mb-1">
            SETT<span className="font-bold text-cyan-400">INGS</span>
          </h1>
          <p className="text-sm text-indigo-200 tracking-wider uppercase">
            Manage system configuration and master data
          </p>
        </div>

        {/* Settings Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Warehouses Card */}
          <Link href="/settings/warehouses">
            <div className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-900/20 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-500/50 transition-colors">
                    <Warehouse className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">Warehouses</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Manage warehouse locations and their details
                </p>
                <p className="text-xs text-slate-500">
                  Add, edit, or remove warehouse facilities
                </p>
              </div>
            </div>
          </Link>

          {/* Locations Card */}
          <Link href="/settings/locations">
            <div className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 transition-all duration-300 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/20 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:border-purple-500/50 transition-colors">
                    <MapPin className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors mb-2">Storage Locations</h3>
                <p className="text-sm text-slate-400 mb-3">
                  Manage storage locations within warehouses
                </p>
                <p className="text-xs text-slate-500">
                  Configure aisles, shelves, and storage areas
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
