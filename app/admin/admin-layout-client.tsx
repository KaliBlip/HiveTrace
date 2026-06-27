'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Menu, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md lg:hidden shrink-0 z-30">
          <div className="flex items-center gap-2.5 font-bold">
            <span className="grid size-9 place-items-center rounded-md bg-primary text-primary-foreground">
              <Shield className="size-4.5" />
            </span>
            <span className="font-heading text-lg tracking-tight">
              Hive<span className="text-primary">Trace</span>{' '}
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                Admin
              </span>
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

        <main className="relative flex-1 overflow-y-auto min-w-0">
          <div className="pointer-events-none absolute inset-0 hive-grid opacity-70" />
          <div className="relative p-6 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
