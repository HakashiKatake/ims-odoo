'use client';

import Link from 'next/link';
import { FileText, Truck, ArrowLeftRight, Wrench } from 'lucide-react';

export default function OperationsPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="space-y-6 animate-fade-in pb-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-indigo-500/30 pb-6 relative">
          <div className="absolute bottom-0 left-0 w-32 h-[2px] bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
          <div>
            <h1 className="text-4xl font-light text-white tracking-tight mb-1">
              OPERA<span className="font-bold text-cyan-400">TIONS</span>
            </h1>
            <p className="text-sm text-indigo-200 tracking-wider uppercase">
              Manage all inventory operations and movements
            </p>
          </div>
        </div>

        {/* Operation Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Receipts */}
          <Link href="/operations/receipts">
            <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 cursor-pointer transition-all hover:border-blue-500/50 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all">
                    <FileText className="h-8 w-8 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Receipts</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Incoming inventory operations
                </p>
                <p className="text-xs text-slate-500">
                  Manage incoming stock from vendors and suppliers
                </p>
              </div>
            </div>
          </Link>

          {/* Deliveries */}
          <Link href="/operations/deliveries">
            <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 cursor-pointer transition-all hover:border-green-500/50 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-600/20 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 group-hover:bg-green-500 group-hover:border-green-400 transition-all">
                    <Truck className="h-8 w-8 text-green-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Deliveries</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Outgoing inventory operations
                </p>
                <p className="text-xs text-slate-500">
                  Manage outbound shipments to customers
                </p>
              </div>
            </div>
          </Link>

          {/* Transfers */}
          <Link href="/operations/transfers">
            <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 cursor-pointer transition-all hover:border-purple-500/50 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-violet-600/20 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:bg-purple-500 group-hover:border-purple-400 transition-all">
                    <ArrowLeftRight className="h-8 w-8 text-purple-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transfers</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Internal stock movements
                </p>
                <p className="text-xs text-slate-500">
                  Move inventory between locations and warehouses
                </p>
              </div>
            </div>
          </Link>

          {/* Adjustments */}
          <Link href="/operations/adjustments">
            <div className="card p-0 group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 cursor-pointer transition-all hover:border-orange-500/50 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-600/20 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30 group-hover:bg-orange-500 group-hover:border-orange-400 transition-all">
                    <Wrench className="h-8 w-8 text-orange-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Adjustments</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Inventory corrections
                </p>
                <p className="text-xs text-slate-500">
                  Adjust stock levels for damages, losses, or corrections
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
