'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Info, Keyboard, ScanLine, ShieldCheck, Zap } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QRScanner } from '@/components/consumer/qr-scanner';
import { ConsumerHeader } from '@/components/consumer/header';
import { Footer } from '@/components/footer';

export default function ScannerPage() {
  const router = useRouter();
  const [manualInput, setManualInput] = useState('');
  const [inputType, setInputType] = useState<'camera' | 'manual'>('camera');

  const verifyValue = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (trimmed.includes('/verify/')) {
      router.push(`/verify/${trimmed.split('/verify/')[1]}`);
      return;
    }

    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <ConsumerHeader />

      <main className="relative flex-1 pb-24 md:pb-0">
        <section className="relative overflow-hidden px-4 pb-10 pt-16 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 hive-grid" />
          <div className="relative mx-auto max-w-5xl text-center">
            <Badge className="rounded-full border border-primary/25 bg-primary/12 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Verification scanner
            </Badge>
            <h1 className="mx-auto mt-6 max-w-4xl text-balance font-heading text-5xl font-semibold leading-[0.9] tracking-[-0.03em] sm:text-7xl">
              Scan the code. Read the batch.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              Use your camera or enter a batch code manually to check HiveTrace verification data.
            </p>
          </div>
        </section>

        <section className="px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="mx-auto grid max-w-md grid-cols-2 gap-1 rounded-xl border border-border/60 bg-card/70 p-1.5 shadow-[var(--shadow-soft)] backdrop-blur">
              <button
                onClick={() => setInputType('camera')}
                className={[
                  'flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all',
                  inputType === 'camera' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                <ScanLine className="size-4" />
                Camera
              </button>
              <button
                onClick={() => setInputType('manual')}
                className={[
                  'flex items-center justify-center gap-2 rounded-lg px-3 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-all',
                  inputType === 'manual' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                ].join(' ')}
              >
                <Keyboard className="size-4" />
                Manual
              </button>
            </div>

            {inputType === 'camera' ? (
              <div className="motion-rise">
                <QRScanner onScan={verifyValue} />
              </div>
            ) : (
              <div className="motion-rise rounded-xl border border-border/60 bg-card/72 p-6 text-center shadow-[var(--shadow-soft)] backdrop-blur sm:p-10">
                <span className="mx-auto mb-6 grid size-14 place-items-center rounded-lg bg-primary/12 text-primary">
                  <Zap className="size-7" />
                </span>
                <h2 className="font-heading text-3xl font-semibold tracking-tight">Manual verification</h2>
                <p className="mx-auto mt-3 max-w-lg leading-7 text-muted-foreground">
                  Enter the unique verification hash, scan URL, or batch ID printed on the product label.
                </p>
                <div className="mx-auto mt-8 max-w-xl space-y-3">
                  <input
                    type="text"
                    placeholder="HT-2026-GVA-041"
                    value={manualInput}
                    onChange={(event) => setManualInput(event.target.value)}
                    className="h-14 w-full rounded-lg border border-border/70 bg-background/70 px-5 text-center font-mono text-base uppercase tracking-[0.08em] outline-none transition-colors focus:border-primary"
                  />
                  <Button onClick={() => verifyValue(manualInput)} disabled={!manualInput.trim()} className="w-full">
                    Verify batch
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={Info}
                title="Scanning tip"
                text="Hold your phone steady, keep the QR code inside the frame, and avoid glare from jar labels."
              />
              <InfoCard
                icon={ShieldCheck}
                title="Signature check"
                text="HiveTrace compares the code against signed batch records and opens the verification page."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-5 shadow-[var(--shadow-soft)] backdrop-blur">
      <span className="mb-5 grid size-11 place-items-center rounded-md bg-primary/12 text-primary">
        <Icon className="size-5" />
      </span>
      <p className="font-heading text-xl font-semibold tracking-tight">{title}</p>
      <p className="mt-2 leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
