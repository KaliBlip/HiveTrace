'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Menu, ScanLine, ShieldCheck, User, X, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/hooks/use-auth';
import { useCart } from '@/lib/hooks/use-cart';
import { getRoleHomePath } from '@/lib/helpers';

const desktopNavItems = [
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Marketplace' },
  { href: '/consumer/scanner', label: 'Scan' },
  { href: '/contact', label: 'Contact' },
];

const mobileMenuItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About HiveTrace' },
  { href: '/shop', label: 'Marketplace' },
  { href: '/consumer/scanner', label: 'Scan Packaging' },
  { href: '/contact', label: 'Contact Support' },
];

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-lg border border-border/60 bg-background/72 px-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:px-5">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid size-10 place-items-center rounded-md bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:-rotate-6">
            <ShieldCheck className="size-5" />
            <span className="absolute inset-0 rounded-md border border-primary/40" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Hive<span className="text-primary">Trace</span>
          </span>
        </Link>

        <div className="hidden items-center rounded-full border border-border/60 bg-card/45 p-1 lg:flex">
          {desktopNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-all',
                isActive(item.href)
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
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
            <>
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/auth/register">
                <Button>
                  <ScanLine className="size-4" />
                  Join network
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
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
            onClick={() => setIsMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-md border border-border/60 bg-card/55 text-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="mx-auto mt-2 max-w-7xl rounded-lg border border-border/60 bg-background/92 p-3 shadow-[var(--shadow-lift)] backdrop-blur-2xl lg:hidden motion-rise">
          <div className="grid gap-1">
            {mobileMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={[
                  'rounded-md px-4 py-3 text-lg font-semibold transition-colors',
                  isActive(item.href) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-3 grid gap-2 border-t border-border/60 pt-3">
            {isAuthenticated ? (
              <>
                <Link href={accountHref} onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Open account</Button>
                </Link>
                <Button variant="outline" className="w-full gap-2" onClick={() => { logout(); setIsMenuOpen(false); }}>
                  <LogOut className="size-4" />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Join network</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
