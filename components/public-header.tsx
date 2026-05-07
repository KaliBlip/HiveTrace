'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/lib/hooks/use-auth';
import { LayoutDashboard, User } from 'lucide-react';

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, role, user } = useAuth();
  const currentRole = role?.toLowerCase();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-white/10 z-[100]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-primary-foreground font-bold text-xl">🍯</span>
          </div>
          <span className="font-heading font-black text-2xl tracking-tighter uppercase italic text-foreground">HiveTrace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link 
            href="/about" 
            className={`text-base font-normal transition-all hover:text-primary relative group ${
              isActive('/about') ? 'text-primary' : 'text-foreground'
            }`}
          >
            About Us
            <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full ${isActive('/about') ? 'w-full' : ''}`} />
          </Link>
          <Link 
            href="/shop" 
            className={`text-base font-normal transition-all hover:text-primary relative group ${
              isActive('/shop') ? 'text-primary' : 'text-foreground'
            }`}
          >
            Marketplace
            <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full ${isActive('/shop') ? 'w-full' : ''}`} />
          </Link>
          <Link 
            href="/contact" 
            className={`text-base font-normal transition-all hover:text-primary relative group ${
              isActive('/contact') ? 'text-primary' : 'text-foreground'
            }`}
          >
            Contact
            <span className={`absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all group-hover:w-full ${isActive('/contact') ? 'w-full' : ''}`} />
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <Link href={currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer'}>
              <Button size="sm" className="font-semibold gap-2">
                {user?.image ? (
                  <img src={user.image} alt="" className="w-5 h-5 rounded-full object-cover" />
                ) : currentRole === 'producer' || currentRole === 'admin' ? (
                  <LayoutDashboard className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
                {currentRole === 'producer' || currentRole === 'admin' ? 'Dashboard' : 'Account'}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="font-semibold">
                  Join Now
                </Button>
              </Link>
            </>
          )}
          <div className="pl-4 border-l border-white/10">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 text-foreground/80 hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-card z-[90] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-6 space-y-8 h-full bg-card">
            <div className="flex flex-col space-y-6">
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive('/about') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                About Us
              </Link>
              <Link 
                href="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive('/shop') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                Marketplace
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive('/contact') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
            
            <div className="pt-8 border-t border-border flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-4">
                <span className="font-bold text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                <Link 
                  href={currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full h-14 text-lg font-black bg-primary text-primary-foreground rounded-xl shadow-xl gap-2">
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
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-14 text-lg font-bold border-2 border-border">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full h-14 text-lg font-black bg-foreground hover:bg-primary text-primary-foreground rounded-xl shadow-xl">
                      Join the Network
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

