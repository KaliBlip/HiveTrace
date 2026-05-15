'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Menu, ScanLine, ShieldCheck, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/hooks/use-auth';

const navItems = [
  { href: '/about', label: 'About' },
  { href: '/shop', label: 'Marketplace' },
  { href: '/consumer/scanner', label: 'Scan' },
  { href: '/contact', label: 'Contact' },
];

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, role, user } = useAuth();
  const currentRole = role?.toLowerCase();
  const accountHref = currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer';

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
          {navItems.map((item) => (
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
            {navItems.map((item) => (
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
              <Link href={accountHref} onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Open account</Button>
              </Link>
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
