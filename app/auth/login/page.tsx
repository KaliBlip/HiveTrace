'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-rise-in">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Sign in to HiveTrace</h1>
        <p className="text-sm text-muted-foreground">Welcome back. Enter your credentials to access your workspace.</p>
      </div>

      <div className="motion-rise rounded-xl border border-border/60 bg-card/76 shadow-[var(--shadow-lift)] backdrop-blur-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <LoginForm />
        </div>
      </div>

      <Link
        href="/auth/register"
        className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card/45 px-4 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:scale-[0.98] transition-all"
      >
        New to HiveTrace? Create an account
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
