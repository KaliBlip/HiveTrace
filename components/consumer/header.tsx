'use client';

import Link from 'next/link';
import { LayoutDashboard, Menu, Package, ScanLine, ShieldCheck, ShoppingBag, User, X, ShoppingCart, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/hooks/use-auth';
import { useCart } from '@/lib/hooks/use-cart';
import { getRoleHomePath } from '@/lib/helpers';

const navItems = [
  { href: '/shop', label: 'Marketplace', icon: ShoppingBag },
  { href: '/consumer/scanner', label: 'Scanner', icon: ScanLine },
  { href: '/consumer/orders', label: 'Orders', icon: Package },
];

const mobileMenuItems = [
  { href: '/', label: 'HiveTrace home' },
  { href: '/about', label: 'About HiveTrace' },
  { href: '/contact', label: 'Contact support' },
];

export function ConsumerHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, role, user, logout } = useAuth();
  const { toggleOpen, totalItems } = useCart();
  const currentRole = role?.toLowerCase();
  const accountHref = getRoleHomePath(currentRole);
  const accountLabel =
    currentRole === 'admin' ? 'Admin' : currentRole === 'producer' ? 'Dashboard' : 'Account';
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const cartItemsCount = mounted ? totalItems() : 0;
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
            <>
              <Link href={accountHref}>
                <Button className="gap-2">
                  {user?.image ? (
                    <img src={user.image} alt="" className="size-5 rounded-full object-cover" />
                  ) : currentRole === 'producer' || currentRole === 'admin' ? (
                    <LayoutDashboard className="size-4" />
                  ) : (
                    <User className="size-4" />
                  )}
                  {accountLabel}
                </Button>
              </Link>
              <Button variant="outline" className="gap-2" onClick={() => logout()}>
                <LogOut className="size-4" />
                Sign out
              </Button>
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="outline">Sign in</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={toggleOpen}
            className="relative grid size-11 place-items-center rounded-md border border-border/60 bg-card/55 text-foreground active:scale-[0.98] transition-transform"
            aria-label="Open cart"
          >
            <ShoppingCart className="size-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full text-[9px] shadow ring-2 ring-background animate-in zoom-in duration-200">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-md border border-border/60 bg-card/55 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/96 p-3 md:hidden motion-rise">
          <nav className="grid gap-1">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={[
                  'rounded-md px-4 py-3 font-semibold transition-colors',
                  pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid gap-2 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/50 px-4 py-3">
              <span className="text-sm font-semibold text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <>
                <Link href={accountHref} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Open account</Button>
                </Link>
                <Button variant="outline" className="w-full gap-2" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
