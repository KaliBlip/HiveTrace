'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md mx-auto space-y-6 animate-rise-in">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Create your Account</h1>
        <p className="text-sm text-muted-foreground">Get started with HiveTrace to register honey batches or verify provenance.</p>
      </div>

      <div className="motion-rise rounded-xl border border-border/60 bg-card/76 shadow-[var(--shadow-lift)] backdrop-blur-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <RegisterForm />
        </div>
      </div>

      <Link
        href="/auth/login"
        className="flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card/45 px-4 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground active:scale-[0.98] transition-all"
      >
        Already have an account? Sign in
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
