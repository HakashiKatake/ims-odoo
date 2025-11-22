'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import { Package, Home, History, Settings, Warehouse, Activity, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StockMasterLogo } from './stock-master-logo';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Stock', href: '/stock', icon: Warehouse },
  { name: 'Operations', href: '/operations', icon: Boxes },
  { name: 'Activity Log', href: '/activity-logs', icon: Activity },
  { name: 'Move History', href: '/move-history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B0E14] border-r border-[#2A3241] flex flex-col z-40">
      {/* Logo Section */}
      <div className="p-6 border-b border-[#2A3241]">
        <StockMasterLogo linkTo="/dashboard" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
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
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#1A1F2E]'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-400 rounded-r-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              )}
              
              <Icon 
                className={cn(
                  "h-5 w-5 mr-3 transition-all duration-200",
                  isActive 
                    ? "text-cyan-400" 
                    : "text-slate-500 group-hover:text-cyan-300"
                )} 
              />
              <span className={cn(
                "tracking-wide",
                isActive && "font-semibold"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-[#2A3241] bg-[#151A25]/50">
        {user && (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300">
            <div className="ring-2 ring-cyan-500/20 rounded-full hover:ring-cyan-500/50 transition-all">
              <UserButton 
                afterSignOutUrl="/landingpage" 
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10"
                  }
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.fullName || user.emailAddresses[0]?.emailAddress}
              </p>
              <p className="text-xs text-cyan-400 capitalize font-mono tracking-wider">
                {(user.unsafeMetadata?.role as string) || 'staff'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
