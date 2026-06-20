'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Fingerprint,
  Leaf,
  PackageCheck,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/footer';
import { PublicHeader } from '@/components/public-header';

const trustSignals = [
  { label: 'Verified batches', value: '12k+' },
  { label: 'Producer trust score', value: '98%' },
  { label: 'Scan events logged', value: '240k' },
];

const workflow = [
  {
    icon: Fingerprint,
    title: 'Batch identity',
    text: 'Producers register harvest details and sign every batch with a tamper-evident HMAC hash.',
  },
  {
    icon: QrCode,
    title: 'Smart scan trail',
    text: 'Consumers scan packaging to see origin, producer reputation, scan history, and traceability data.',
  },
  {
    icon: BarChart3,
    title: 'Reputation loop',
    text: 'Orders, reviews, and fraud signals feed dashboards for producers and administrators.',
  },
];

const highlights = [
  { icon: ShieldCheck, label: 'Cryptographic verification' },
  { icon: PackageCheck, label: 'Batch-to-product marketplace' },
  { icon: Leaf, label: 'Producer provenance profiles' },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />

      <main>
        <section className="relative min-h-[92vh] px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 hive-grid" />
          <div className="pointer-events-none absolute inset-x-4 top-24 h-[34rem] rounded-[2rem] border border-border/40 bg-card/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="motion-rise space-y-8">
              <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm">
                Verified honey infrastructure
              </Badge>

              <div className="space-y-5">
                <h1 className="text-balance font-heading text-5xl font-semibold tracking-[-0.03em] leading-[0.88] sm:text-7xl lg:text-[6.8rem]">
                  Trust every jar before it reaches the table.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
                  HiveTrace gives honey producers a clean operating system for batch signing, marketplace listings,
                  QR verification, consumer orders, and fraud-aware traceability.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/shop">
                  <Button size="lg" className="w-full gap-2 sm:w-auto">
                    Explore marketplace
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=producer">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Register producer
                  </Button>
                </Link>
              </div>

              <div className="grid max-w-2xl grid-cols-3 gap-3 pt-4">
                {trustSignals.map((signal, index) => (
                  <div
                    key={signal.label}
                    className="motion-rise rounded-lg border border-border/60 bg-card/55 p-4 backdrop-blur"
                    style={{ animationDelay: `${140 + index * 80}ms` }}
                  >
                    <p className="font-heading text-3xl font-semibold tracking-tight">{signal.value}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {signal.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="motion-rise motion-delay-2">
              <div className="glass-panel scan-line relative overflow-hidden rounded-xl border p-3">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                  <img
                    src="/hero-beehive.jpg"
                    alt="Honeycomb frames from a beehive"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/18 bg-black/38 p-4 text-white backdrop-blur-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Live verification</p>
                        <p className="mt-1 font-heading text-2xl font-semibold">HT-2026-GVA-041</p>
                      </div>
                      <div className="grid size-12 place-items-center rounded-md bg-primary text-primary-foreground">
                        <BadgeCheck className="size-6" />
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <span className="rounded-md bg-white/10 px-3 py-2">Origin signed</span>
                      <span className="rounded-md bg-white/10 px-3 py-2">Scan logged</span>
                      <span className="rounded-md bg-white/10 px-3 py-2">Fraud clear</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/38 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/40 p-4">
                  <span className="grid size-10 place-items-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-semibold">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-2xl space-y-4">
                <Badge className="rounded-full bg-muted text-muted-foreground">Traceability workflow</Badge>
                <h2 className="text-balance font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
                  One platform for the whole honey chain.
                </h2>
              </div>
              <Link href="/consumer/scanner">
                <Button variant="outline" className="gap-2">
                  Try scanner
                  <QrCode className="size-4" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {workflow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="motion-rise rounded-xl border border-border/60 bg-card/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <span className="mb-10 grid size-12 place-items-center rounded-md bg-foreground text-background">
                      <Icon className="size-6" />
                    </span>
                    <p className="font-heading text-2xl font-semibold tracking-tight">{item.title}</p>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-xl border border-border/60 bg-foreground text-background shadow-[var(--shadow-lift)] lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-8 sm:p-12 lg:p-16">
              <Sparkles className="mb-8 size-10 text-primary" />
              <h2 className="text-balance font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
                Built for real producers, not generic storefronts.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-background/70">
                Dashboards focus on batch registration, listings, scan analytics, orders, and reputation signals so
                daily operations stay fast and auditable.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/register?role=producer">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Start as producer</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-background/20 bg-transparent text-background hover:bg-background/10">
                    Learn more
                  </Button>
                </Link>
              </div>
            </div>
            <div className="min-h-[360px] bg-[url('/verification-badge.jpg')] bg-cover bg-center" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
