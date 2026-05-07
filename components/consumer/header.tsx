'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/hooks/use-auth';
import { LayoutDashboard, User } from 'lucide-react';

export function ConsumerHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, role, user } = useAuth();
  const currentRole = role?.toLowerCase();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className={`sticky top-0 z-50 backdrop-blur transition-all duration-300 ${
        transparent 
          ? 'bg-card md:bg-transparent border-b border-border md:border-white/10 text-foreground md:text-white' 
          : 'bg-card lg:bg-card/80 border-b border-border text-foreground'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-primary-foreground font-bold text-xl">🍯</span>
            </div>
            <span className={`hidden sm:inline font-black text-2xl tracking-tighter uppercase italic ${transparent ? 'text-foreground md:text-white' : 'text-foreground'}`}>HiveTrace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/shop"
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive('/shop') 
                  ? 'text-primary' 
                  : transparent ? 'text-muted-foreground/80 hover:text-white' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/consumer/scanner"
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive('/consumer/scanner') 
                  ? 'text-primary' 
                  : transparent ? 'text-muted-foreground/70 hover:text-white' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              QR Scanner
            </Link>
            <Link
              href="/consumer"
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                isActive('/consumer') 
                  ? 'text-primary' 
                  : transparent ? 'text-muted-foreground/70 hover:text-white' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Reputation
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link href={currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer'}>
                <Button className="bg-foreground hover:bg-primary text-primary-foreground h-12 px-6 rounded-xl font-bold shadow-xl transition-all flex items-center gap-2">
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : currentRole === 'producer' || currentRole === 'admin' ? (
                    <LayoutDashboard className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {currentRole === 'producer' || currentRole === 'admin' ? 'Dashboard' : 'My Account'}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className={`font-bold transition-colors ${transparent ? 'text-white hover:bg-white/10' : 'text-muted-foreground hover:text-primary'}`}>Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className={`bg-foreground hover:bg-primary text-primary-foreground h-12 px-6 rounded-xl font-bold shadow-xl transition-all ${transparent ? 'shadow-lg shadow-primary/20 border-none' : ''}`}>
                    Join the Network
                  </Button>
                </Link>
              </>
            )}
            <div className={`pl-4 border-l ${transparent ? 'border-white/20' : 'border-border'}`}>
              <ThemeToggle className={transparent ? 'text-white hover:bg-white/10' : ''} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${transparent ? 'text-foreground md:text-white' : 'text-foreground'}`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="flex flex-col p-4 gap-2">
              <Link 
                href="/shop" 
                className={`px-4 py-2 rounded font-bold transition-colors ${
                  isActive('/shop') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                Marketplace
              </Link>
              <Link 
                href="/consumer/scanner" 
                className={`px-4 py-2 rounded font-bold transition-colors ${
                  isActive('/consumer/scanner') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                QR Scanner
              </Link>
              <Link 
                href="/consumer" 
                className={`px-4 py-2 rounded font-bold transition-colors ${
                  isActive('/consumer') ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                }`}
              >
                Reputation
              </Link>
              <div className="border-t border-border pt-2 mt-2 flex flex-col gap-2">
                <div className="flex justify-between items-center px-4 py-2">
                  <span className="font-bold text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                {isAuthenticated ? (
                  <Link href={currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer'} className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-14 text-lg font-black rounded-xl">
                    {user?.image ? (
                      <img src={user.image} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : currentRole === 'producer' || currentRole === 'admin' ? (
                      <LayoutDashboard className="w-5 h-5" />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    {currentRole === 'producer' || currentRole === 'admin' ? 'Dashboard' : 'My Account'}
                  </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/login" className="w-full">
                      <Button variant="outline" className="w-full h-12">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/register" className="w-full">
                      <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                        Join the Network
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
