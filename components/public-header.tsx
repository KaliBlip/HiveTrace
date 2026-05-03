'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function PublicHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white lg:bg-white/80 backdrop-blur-xl border-b border-stone-200 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-primary-foreground font-bold text-xl">🍯</span>
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic text-[#1c1917]">HiveTrace</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <Link 
            href="/about" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              isActive('/about') ? 'text-primary' : 'text-stone-500 hover:text-primary'
            }`}
          >
            About Us
          </Link>
          <Link 
            href="/shop" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              isActive('/shop') ? 'text-primary' : 'text-stone-500 hover:text-primary'
            }`}
          >
            Marketplace
          </Link>
          <Link 
            href="/contact" 
            className={`text-sm font-bold uppercase tracking-widest transition-colors ${
              isActive('/contact') ? 'text-primary' : 'text-stone-500 hover:text-primary'
            }`}
          >
            Contact
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="font-bold text-stone-500 hover:text-primary">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-stone-900 hover:bg-primary text-white h-12 px-6 rounded-xl font-bold shadow-xl transition-all">
              Join the Network
            </Button>
          </Link>
          <div className="pl-4 border-l border-stone-200">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 text-stone-500 hover:text-primary transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 bg-white z-[90] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col p-6 space-y-8 h-full bg-white">
            <div className="flex flex-col space-y-6">
              <Link 
                href="/about" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive('/about') ? 'text-primary' : 'text-stone-800 hover:text-primary'
                }`}
              >
                About Us
              </Link>
              <Link 
                href="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive('/shop') ? 'text-primary' : 'text-stone-800 hover:text-primary'
                }`}
              >
                Marketplace
              </Link>
              <Link 
                href="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className={`text-2xl font-black uppercase tracking-tight transition-colors ${
                  isActive('/contact') ? 'text-primary' : 'text-stone-800 hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </div>
            
            <div className="pt-8 border-t border-stone-100 flex flex-col space-y-4">
              <div className="flex justify-between items-center pb-4">
                <span className="font-bold text-stone-500">Theme</span>
                <ThemeToggle />
              </div>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full h-14 text-lg font-bold border-2 border-stone-200">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full h-14 text-lg font-black bg-stone-900 hover:bg-primary text-white rounded-xl shadow-xl">
                  Join the Network
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

