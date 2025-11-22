import { Package } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StockMasterLogoProps {
  variant?: 'default' | 'large' | 'compact';
  showVersion?: boolean;
  linkTo?: string;
  className?: string;
}

export function StockMasterLogo({ 
  variant = 'default', 
  showVersion = true,
  linkTo,
  className 
}: StockMasterLogoProps) {
  const sizes = {
    default: {
      icon: 'h-7 w-7',
      iconPadding: 'p-2.5',
      text: 'text-xl',
      version: 'text-[10px]',
    },
    large: {
      icon: 'h-12 w-12',
      iconPadding: 'p-4',
      text: 'text-4xl',
      version: 'text-xs',
    },
    compact: {
      icon: 'h-5 w-5',
      iconPadding: 'p-2',
      text: 'text-lg',
      version: 'text-[8px]',
    },
  };

  const size = sizes[variant];

  const LogoContent = () => (
    <div className={cn('flex items-center space-x-3 group', className)}>
      <div className={cn(
        'bg-cyan-500/10 rounded-lg border border-cyan-500/20 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]',
        size.iconPadding
      )}>
        <Package className={cn(size.icon, 'text-cyan-400')} />
      </div>
      <div>
        <span className={cn(size.text, 'font-bold text-white tracking-tight block')}>
          Stock<span className="text-cyan-400">Master</span>
        </span>
        {showVersion && (
          <span className={cn(size.version, 'text-slate-500 uppercase tracking-widest font-mono block')}>
            IMS v2.0
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo}>
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
}
