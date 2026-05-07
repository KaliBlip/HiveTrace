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
    <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-2xl border-b border-border/40 z-[100]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[128px] h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:rotate-12 group-hover:scale-110">
            <span className="text-primary-foreground font-bold text-2xl">🍯</span>
          </div>
          <span className="font-heading font-black text-3xl tracking-tighter uppercase italic text-foreground leading-none">HiveTrace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-12">
          <Link 
            href="/about" 
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${
              isActive('/about') ? 'text-primary' : 'text-stone-500'
            }`}
          >
            About Us
            <span className={`absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full ${isActive('/about') ? 'w-full' : ''}`} />
          </Link>
          <Link 
            href="/shop" 
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${
              isActive('/shop') ? 'text-primary' : 'text-stone-500'
            }`}
          >
            Marketplace
            <span className={`absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full ${isActive('/shop') ? 'w-full' : ''}`} />
          </Link>
          <Link 
            href="/contact" 
            className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-primary relative group ${
              isActive('/contact') ? 'text-primary' : 'text-stone-500'
            }`}
          >
            Contact
            <span className={`absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all group-hover:w-full ${isActive('/contact') ? 'w-full' : ''}`} />
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-6">
          {isAuthenticated ? (
            <Link href={currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer'}>
              <Button size="lg" className="rounded-full px-8 font-bold gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-105">
                {user?.image ? (
                  <img src={user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
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
              <Link href="/auth/login">
                <Button variant="ghost" size="lg" className="text-stone-500 font-bold uppercase tracking-widest text-[10px] hover:text-primary hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                  Join the Network
                </Button>
              </Link>
            </>
          )}
          <div className="pl-6 border-l border-border/50">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-3 text-foreground/80 hover:text-primary transition-colors focus:outline-none bg-stone-50 rounded-2xl border border-border/40 shadow-sm"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-24 bg-background z-[90] animate-in fade-in slide-in-from-top-8 duration-500">
          <div className="flex flex-col p-10 space-y-12 h-full bg-background overflow-y-auto">
            <div className="flex flex-col space-y-10">
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl font-heading font-bold uppercase tracking-tighter transition-all italic ${
                  isActive('/about') ? 'text-primary' : 'text-stone-400 hover:text-primary'
                }`}
              >
                About Us
              </Link>
              <Link 
                href="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl font-heading font-bold uppercase tracking-tighter transition-all italic ${
                  isActive('/shop') ? 'text-primary' : 'text-stone-400 hover:text-primary'
                }`}
              >
                Marketplace
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-5xl font-heading font-bold uppercase tracking-tighter transition-all italic ${
                  isActive('/contact') ? 'text-primary' : 'text-stone-400 hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
            
            <div className="pt-12 border-t border-border/50 flex flex-col space-y-6 mt-auto pb-12">
              <div className="flex justify-between items-center bg-stone-50 p-6 rounded-[32px] border border-border/40">
                <span className="font-heading font-bold uppercase tracking-widest text-xs text-stone-400">Interface Theme</span>
                <ThemeToggle />
              </div>
              {isAuthenticated ? (
                <Link 
                  href={currentRole === 'producer' || currentRole === 'admin' ? '/dashboard' : '/consumer'}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full h-20 text-xl font-bold rounded-[32px] shadow-2xl shadow-primary/20 gap-4">
                    {user?.image ? (
                      <img src={user.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : currentRole === 'producer' || currentRole === 'admin' ? (
                      <LayoutDashboard className="w-6 h-6" />
                    ) : (
                      <User className="w-6 h-6" />
                    )}
                    {currentRole === 'producer' || currentRole === 'admin' ? 'Dashboard' : 'My Account'}
                  </Button>
                </Link>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full h-20 text-xl font-bold rounded-[32px] border-2 border-stone-200">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full h-20 text-xl font-bold bg-[#1c1917] hover:bg-primary text-white rounded-[32px] shadow-2xl shadow-primary/20">
                      Join the Network
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

