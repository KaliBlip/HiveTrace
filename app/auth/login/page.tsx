'use client';

import Link from 'next/link';
import { ArrowRight, Fingerprint, History, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LoginForm } from '@/components/auth/login-form';

const details = [
  {
    icon: ShieldCheck,
    title: 'Protected account access',
    text: 'Credentials are checked through HiveTrace auth before dashboard and checkout routes open.',
  },
  {
    icon: History,
    title: 'Operational continuity',
    text: 'Return to batches, orders, reviews, analytics, or consumer verification history from one session.',
  },
  {
    icon: Fingerprint,
    title: 'Role-aware routing',
    text: 'Producer, admin, and consumer accounts land in the right workspace after sign in.',
  },
];

export default function LoginPage() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
      <section className="motion-rise space-y-8">
        <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Secure sign in
        </Badge>

        <div className="space-y-5">
          <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
            Reopen your traceability workspace.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Sign in to manage producer batches, inspect orders, scan honey labels, or continue marketplace activity.
          </p>
        </div>

        <div className="grid gap-3">
          {details.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="motion-rise flex gap-4 rounded-lg border border-border/60 bg-card/55 p-4 backdrop-blur"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h2 className="font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="motion-rise motion-delay-2">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-card/76 shadow-[var(--shadow-lift)] backdrop-blur-2xl">
          <div className="border-b border-border/60 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Account gateway</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">Sign in</h2>
          </div>
          <div className="p-6 sm:p-8">
            <LoginForm />
          </div>
        </div>

        <Link
          href="/auth/register"
          className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card/45 px-4 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          New to HiveTrace? Create an account
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
