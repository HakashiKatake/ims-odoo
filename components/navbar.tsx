'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Package, Home, FileText, Truck, ArrowLeftRight, History, Settings, Warehouse, Wrench, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Stock', href: '/stock', icon: Warehouse },
  { name: 'Receipts', href: '/operations/receipts', icon: FileText },
  { name: 'Delivery', href: '/operations/deliveries', icon: Truck },
  { name: 'Transfer', href: '/operations/transfers', icon: ArrowLeftRight },
  { name: 'Adjustments', href: '/operations/adjustments', icon: Wrench },
  { name: 'Activity Log', href: '/activity-logs', icon: Activity },
  { name: 'Move History', href: '/move-history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Package className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">StockMaster</span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-3 pt-1 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.fullName || user.emailAddresses[0]?.emailAddress}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {(user.unsafeMetadata?.role as string) || 'staff'}
                  </p>
                </div>
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
