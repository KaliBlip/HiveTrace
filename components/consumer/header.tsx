'use client';

import Link from 'next/link';
import { Menu, Package, ScanLine, ShieldCheck, ShoppingBag, User, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/hooks/use-auth';

const navItems = [
  { href: '/shop', label: 'Marketplace', icon: ShoppingBag },
  { href: '/consumer/scanner', label: 'Scanner', icon: ScanLine },
  { href: '/consumer/orders', label: 'Orders', icon: Package },
];

export function ConsumerHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, role, user } = useAuth();
  const currentRole = role?.toLowerCase();
  const accountHref = currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer';
  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <header className={`sticky top-0 z-50 border-b backdrop-blur-2xl transition-colors ${
      transparent ? 'border-white/10 bg-background/20' : 'border-border/60 bg-background/76'
    }`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-md bg-foreground text-background">
            <ShieldCheck className="size-5" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Hive<span className="text-primary">Trace</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/45 p-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all',
                  isActive(item.href)
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                ].join(' ')}
              >
                <Icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link href={accountHref}>
              <Button className="gap-2">
                {user?.image ? (
                  <img src={user.image} alt="" className="size-5 rounded-full object-cover" />
                ) : currentRole === 'producer' || currentRole === 'admin' ? (
                  <LayoutDashboard className="size-4" />
                ) : (
                  <User className="size-4" />
                )}
                {currentRole === 'producer' || currentRole === 'admin' ? 'Dashboard' : 'Account'}
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline">Sign in</Button>
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="grid size-11 place-items-center rounded-md border border-border/60 bg-card/55 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/96 p-3 md:hidden motion-rise">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={[
                  'rounded-md px-4 py-3 font-semibold transition-colors',
                  isActive(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
            <span className="text-sm font-semibold text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
