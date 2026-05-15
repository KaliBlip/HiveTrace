'use client';

import Link from 'next/link';
import { ArrowRight, BadgeCheck, Database, Sprout, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { RegisterForm } from '@/components/auth/register-form';

const details = [
  {
    icon: BadgeCheck,
    title: 'Create one identity',
    text: 'Use the same account for consumer verification or producer batch operations.',
  },
  {
    icon: Database,
    title: 'Prepare signed records',
    text: 'Producer accounts receive a profile that can register and publish traceable honey batches.',
  },
  {
    icon: Sprout,
    title: 'Support clean provenance',
    text: 'Verified orders and reviews help ethical producers build a reputation consumers can inspect.',
  },
];

export default function RegisterPage() {
  return (
    <div className="grid w-full gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
      <section className="motion-rise space-y-8">
        <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Network enrollment
        </Badge>

        <div className="space-y-5">
          <h1 className="text-balance font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
            Create your HiveTrace identity.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Join as a consumer to verify purchases, or as a producer to register batches and sell traceable honey.
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
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-md bg-foreground text-background">
                <Users className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Account setup</p>
                <h2 className="font-heading text-3xl font-semibold tracking-tight">Register</h2>
              </div>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            <RegisterForm />
          </div>
        </div>

        <Link
          href="/auth/login"
          className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-card/45 px-4 py-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          Already have an account? Sign in
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
