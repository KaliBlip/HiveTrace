import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertCircle, ArrowRight, Clock, Package, Plus, ShieldCheck, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProducerStats } from '@/lib/actions/producer-actions';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const sessionUser = session.user as typeof session.user & { role?: string };
  const role = sessionUser.role;
  if (role === 'CONSUMER') redirect('/shop');
  if (role === 'ADMIN') redirect('/admin');

  const statsData = await getProducerStats();
  const producer = statsData.producer as typeof statsData.producer & {
    ratings?: { averageRating?: number | null } | null;
    businessName?: string;
    verified?: boolean;
  };
  const rating = producer.ratings?.averageRating || 5;

  const stats = [
    { title: 'Batches', value: statsData.batchCount.toLocaleString(), detail: 'Registered records', icon: Package },
    { title: 'Scans', value: statsData.scanCount.toLocaleString(), detail: 'Network events', icon: Zap },
    { title: 'Rating', value: rating.toFixed(1), detail: 'Consumer signal', icon: Star },
    { title: 'Trust', value: `${Math.round(rating * 20)}%`, detail: 'Reputation score', icon: ShieldCheck },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      <section className="motion-rise overflow-hidden rounded-xl border border-border/60 bg-card/68 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
          <div className="max-w-3xl space-y-4">
            <Badge className="rounded-full bg-primary/12 text-primary">Producer command</Badge>
            <h1 className="text-balance font-heading text-4xl font-semibold tracking-tight sm:text-6xl">
              Monitor batch trust, orders, and marketplace performance.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              Operating as <span className="font-semibold text-foreground">{producer.businessName || 'your apiary'}</span>.
              Register new harvest batches, publish products, and watch verification activity.
            </p>
          </div>
          <div className="flex items-end">
            <Link href="/dashboard/batches/new">
              <Button size="lg" className="gap-2">
                <Plus className="size-4" />
                Register batch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="motion-rise rounded-xl border border-border/60 bg-card/72 p-5 shadow-[var(--shadow-soft)] backdrop-blur"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-md bg-primary/12 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{stat.detail}</span>
              </div>
              <p className="mt-8 font-heading text-4xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{stat.title}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-xl border border-border/60 bg-card/72 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">Recent batches</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest cryptographic registrations.</p>
            </div>
            <Link href="/dashboard/batches">
              <Button variant="outline" className="gap-2">
                View ledger
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {statsData.recentBatches.length === 0 ? (
              <div className="p-10 text-center">
                <Package className="mx-auto mb-4 size-10 text-muted-foreground" />
                <p className="font-semibold">No batches yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Register your first harvest batch to begin the traceability chain.</p>
              </div>
            ) : (
              statsData.recentBatches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-muted/45">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-foreground text-background font-heading font-semibold">
                      {batch.honeyType.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{batch.batchCode}</p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        {new Date(batch.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        <span className="hidden sm:inline">· {batch.honeyType}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-2xl font-semibold">{batch._count.qrCodes}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">QR codes</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="scan-line overflow-hidden rounded-xl border border-border/60 bg-foreground p-6 text-background shadow-[var(--shadow-lift)]">
            <ShieldCheck className="mb-8 size-9 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-background/58">Trust status</p>
            <p className="mt-3 font-heading text-5xl font-semibold tracking-tight">{Math.round(rating * 20)}%</p>
            <p className="mt-4 leading-7 text-background/68">
              Reputation reflects verified batches, consumer reviews, and scan confidence.
            </p>
          </div>

          {!producer.verified && (
            <div className="rounded-xl border border-primary/25 bg-primary/10 p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="size-5 text-primary" />
                <p className="font-semibold">Verification pending</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your producer profile is still under review. Marketplace access may be limited until approval.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
