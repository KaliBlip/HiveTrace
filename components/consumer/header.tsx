'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function ConsumerHeader({ transparent = false }: { transparent?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <header className={`sticky top-0 z-50 backdrop-blur transition-all duration-300 ${
        transparent 
          ? 'bg-white md:bg-transparent border-b border-stone-200 md:border-white/10 text-[#1c1917] md:text-white' 
          : 'bg-background/95 border-b border-border text-foreground'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
              🍯
            </div>
            <span className={`hidden sm:inline ${transparent ? 'text-[#1c1917] md:text-white' : 'text-foreground'}`}>HiveTrace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/shop"
              className={`font-bold transition-colors ${
                isActive('/shop') 
                  ? 'text-primary' 
                  : transparent ? 'text-stone-300 hover:text-white' : 'text-foreground hover:text-primary'
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/consumer/scanner"
              className={`font-bold transition-colors ${
                isActive('/consumer/scanner') 
                  ? 'text-primary' 
                  : transparent ? 'text-stone-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              QR Scanner
            </Link>
            <Link
              href="/consumer"
              className={`font-bold transition-colors ${
                isActive('/consumer') 
                  ? 'text-primary' 
                  : transparent ? 'text-stone-400 hover:text-white' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reputation
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="ghost" className={transparent ? 'text-white hover:bg-white/10' : ''}>Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className={`bg-primary hover:bg-primary/90 text-primary-foreground ${transparent ? 'shadow-lg shadow-primary/20 border-none' : ''}`}>
                Join the Network
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${transparent ? 'text-[#1c1917] md:text-white' : 'text-foreground'}`}
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
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Join the Network
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
