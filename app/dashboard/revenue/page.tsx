import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Coins,
  CreditCard,
  DollarSign,
  Layers,
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getProducerRevenueStats } from '@/lib/actions/revenue-actions';
import { RevenueCharts } from '@/components/dashboard/revenue-charts';

export default async function ProducerRevenuePage() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const stats = await getProducerRevenueStats();

  if (!stats) {
    return (
      <div className="mx-auto max-w-5xl py-12 text-center space-y-4">
        <h1 className="text-2xl font-bold">Producer Profile Required</h1>
        <p className="text-muted-foreground">
          You need an active producer profile to access revenue analytics.
        </p>
        <Link href="/dashboard/settings">
          <Button>Complete Profile</Button>
        </Link>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Accumulated Revenue',
      value: `GH₵ ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: 'Settled earnings from paid orders',
      icon: Coins,
      highlight: true,
    },
    {
      title: 'Pending Settlement',
      value: `GH₵ ${stats.pendingRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: 'From awaiting/unpaid orders',
      icon: Clock,
      highlight: false,
    },
    {
      title: 'Units Sold',
      value: stats.unitsSold.toLocaleString(),
      detail: 'Total products dispatched',
      icon: Package,
      highlight: false,
    },
    {
      title: 'Average Order Value',
      value: `GH₵ ${stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: 'Avg payout per order',
      icon: TrendingUp,
      highlight: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Settled (Paid)</Badge>;
      case 'DELIVERED':
        return <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">Delivered</Badge>;
      case 'SHIPPED':
        return <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30">Shipped</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">Pending Payment</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-16">
      {/* Header Banner */}
      <section className="motion-rise overflow-hidden rounded-xl border border-border/60 bg-card/68 p-6 shadow-[var(--shadow-soft)] backdrop-blur sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-primary/12 text-primary">Financial Ledger</Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <Sparkles className="mr-1 size-3" /> Auto-Split Reconciled
              </Badge>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Producer Revenue & Earnings
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Real-time accumulated revenue from marketplace orders. Multi-producer carts are automatically
              split to isolate and accumulate your exact designated product earnings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/orders">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="size-4" />
                View Incoming Orders
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`motion-rise rounded-xl border p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-all ${
                kpi.highlight
                  ? 'border-primary/40 bg-primary/8 shadow-primary/5 ring-1 ring-primary/20'
                  : 'border-border/60 bg-card/72'
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`grid size-11 place-items-center rounded-lg ${
                    kpi.highlight ? 'bg-primary text-primary-foreground' : 'bg-primary/12 text-primary'
                  }`}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {kpi.detail}
                </span>
              </div>
              <p className="mt-6 font-heading text-3xl font-bold tracking-tight">{kpi.value}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{kpi.title}</p>
            </div>
          );
        })}
      </section>

      {/* Multi-Vendor Cart Split Feature Callout */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
              <Layers className="size-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                Automated Multi-Producer Cart Revenue Splitting
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                When a buyer purchases products from multiple apiaries in a single checkout, HiveTrace
                automatically splits and allocates each item's revenue strictly to its producer's ledger.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <ShieldCheck className="mr-1 size-3.5" /> 100% Isolated Ledger
            </Badge>
          </div>
        </div>
      </section>

      {/* Revenue Charts */}
      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Earnings Analytics</h2>
        <RevenueCharts
          dailyRevenue={stats.dailyRevenue}
          monthlyRevenue={stats.monthlyRevenue}
          productBreakdown={stats.productRevenueBreakdown}
        />
      </section>

      {/* Revenue by Product Breakdown */}
      <section className="space-y-4">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Product Performance</h2>
        {stats.productRevenueBreakdown.length === 0 ? (
          <Card className="border-border/60 bg-card/70 p-8 text-center text-muted-foreground">
            No sales recorded yet. Once your honey products are ordered, earnings breakdown will display here.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.productRevenueBreakdown.map((item) => (
              <Card key={item.productId} className="border-border/60 bg-card/75 shadow-[var(--shadow-soft)]">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-foreground">{item.productName}</h4>
                      <p className="text-xs text-muted-foreground">Batch: {item.batchCode} · {item.honeyType}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      GH₵{item.price} / unit
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Units Sold</p>
                      <p className="font-heading font-semibold text-lg">{item.unitsSold}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Accumulated</p>
                      <p className="font-heading font-semibold text-lg text-primary">
                        GH₵{item.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Recent Revenue Transactions / Split Ledger */}
      <section className="rounded-xl border border-border/60 bg-card/75 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Split Transactions & Orders</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Itemized history of orders containing your honey products and your designated revenue share.
            </p>
          </div>
          <Link href="/dashboard/orders">
            <Button variant="outline" className="gap-2">
              Fulfill Orders
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-border/60">
          {stats.recentTransactions.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <ShoppingBag className="mx-auto mb-3 size-10 text-muted-foreground/60" />
              <p className="font-semibold">No order revenue recorded yet</p>
              <p className="mt-1 text-sm">When customers purchase your listings from the marketplace, your share will be tracked here.</p>
            </div>
          ) : (
            stats.recentTransactions.map((tx) => (
              <div key={tx.orderId} className="p-5 sm:p-6 transition-colors hover:bg-muted/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold bg-muted px-2 py-1 rounded">
                      #{tx.orderId.slice(-6).toUpperCase()}
                    </span>
                    {getStatusBadge(tx.status)}
                    {tx.isMultiProducerCart && (
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                        Multi-Producer Split
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="size-3.5" />
                    {new Date(tx.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Customer</p>
                    <p className="font-medium text-sm text-foreground">{tx.consumerName}</p>
                    {tx.consumerEmail && <p className="text-xs text-muted-foreground">{tx.consumerEmail}</p>}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Your Items in Order</p>
                    <div className="space-y-0.5">
                      {tx.items.map((it, idx) => (
                        <p key={idx} className="text-xs text-foreground font-medium">
                          {it.productName} <span className="text-muted-foreground">× {it.quantity} (GH₵{it.subtotal})</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 sm:text-right lg:text-right">
                    <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Your Designated Revenue</p>
                    <p className="font-heading text-xl font-bold text-primary">
                      GH₵{tx.producerTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
