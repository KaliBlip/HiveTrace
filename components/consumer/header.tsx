'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ConsumerHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              🍯
            </div>
            <span className="hidden sm:inline">HiveTrace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/consumer"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Scan Honey
            </Link>
            <Link
              href="/consumer/scanner"
              className="text-muted-foreground hover:text-foreground transition"
            >
              QR Scanner
            </Link>
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground transition"
            >
              Dashboard
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
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
              <Link href="/consumer" className="px-4 py-2 hover:bg-muted rounded">
                Scan Honey
              </Link>
              <Link
                href="/consumer/scanner"
                className="px-4 py-2 hover:bg-muted rounded"
              >
                QR Scanner
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 hover:bg-muted rounded"
              >
                Dashboard
              </Link>
              <div className="border-t border-border pt-2 mt-2 flex flex-col gap-2">
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
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
