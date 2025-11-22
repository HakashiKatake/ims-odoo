'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Package, Home, History, Settings, Warehouse, Activity, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Stock', href: '/stock', icon: Warehouse },
  { name: 'Operations', href: '/operations', icon: Boxes },
  { name: 'Activity Log', href: '/activity-logs', icon: Activity },
  { name: 'Move History', href: '/move-history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <nav className="border-b border-[#2A3241] bg-[#151A25]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                  <Package className="h-6 w-6 text-cyan-400" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Stock<span className="text-cyan-400">Master</span></span>
              </Link>
            </div>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href === '/operations' && pathname.startsWith('/operations')) ||
                  (item.href !== '/operations' && pathname.startsWith(item.href + '/'));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md',
                      isActive
                        ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                        : 'text-slate-400 hover:text-white hover:bg-[#2A3241]/50 border border-transparent'
                    )}
                  >
                    <Icon className={cn("mr-2 h-4 w-4", isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300")} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-[#2A3241]">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white">{user.fullName || user.emailAddresses[0]?.emailAddress}</p>
                  <p className="text-xs text-cyan-400 capitalize font-mono">
                    {(user.unsafeMetadata?.role as string) || 'staff'}
                  </p>
                </div>
                <div className="ring-2 ring-[#2A3241] rounded-full">
                  <UserButton afterSignOutUrl="/" appearance={{
                    elements: {
                      avatarBox: "h-9 w-9"
                    }
                  }}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
