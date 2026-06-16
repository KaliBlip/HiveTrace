'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, ScanLine, ShoppingBag } from 'lucide-react';

const tabs = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Market', icon: ShoppingBag },
  { href: '/consumer/scanner', label: 'Scanner', icon: ScanLine },
  { href: '/consumer/orders', label: 'Orders', icon: Package },
];

const hiddenPrefixes = ['/auth', '/admin', '/dashboard', '/checkout', '/consumer/scanner'];

export function MobileTabBar() {
  const pathname = usePathname();

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-[120] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1 rounded-xl border border-border/70 bg-background/88 p-1.5 shadow-[0_20px_80px_-32px_oklch(0_0_0/0.72)] backdrop-blur-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                'group flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[11px] font-semibold transition-all',
                active
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              ].join(' ')}
            >
              <Icon className={['size-5 transition-transform', active ? '-translate-y-0.5' : 'group-hover:-translate-y-0.5'].join(' ')} />
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
