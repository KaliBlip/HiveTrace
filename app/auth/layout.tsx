import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 hive-grid" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/12 blur-[120px]" />

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-lg border border-border/60 bg-background/76 px-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:px-5">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-md bg-foreground text-background transition-transform group-hover:-rotate-6">
              <ShieldCheck className="size-5" />
            </span>
            <span className="font-heading text-xl font-semibold tracking-tight">
              Hive<span className="text-primary">Trace</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground sm:flex"
            >
              <ArrowLeft className="size-4" />
              Home
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
