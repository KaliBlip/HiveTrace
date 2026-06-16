'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Menu, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar with mobile toggle logic */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Content wrapper */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile top-bar navigation */}
        <header className="flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md lg:hidden shrink-0 z-30">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="size-4.5" />
            </span>
            <span className="font-heading text-lg tracking-tight">
              Hive<span className="text-primary">Trace</span>
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl border border-border/60 h-10 w-10 flex items-center justify-center bg-card/50"
            aria-label="Open navigation menu"
          >
            <Menu className="size-5" />
          </Button>
        </header>

        {/* Content body */}
        <main className="relative flex-1 overflow-y-auto min-w-0">
          <div className="pointer-events-none absolute inset-0 hive-grid opacity-70" />
          <div className="relative p-6 sm:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
