import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Coins,
  DollarSign,
  TrendingUp,
  Percent,
  Layers,
  Building,
  Smartphone,
  Package,
  ShoppingBag,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getAdminMarketplaceFinances } from '@/lib/actions/admin-financial-actions';

export default async function AdminFinancesPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard');

  const finances = await getAdminMarketplaceFinances();

  if (!finances) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Access Denied or Financial Data Unavailable.
      </div>
    );
  }

  const kpis = [
    {
      title: 'Platform Gross GMV',
      value: `GH₵ ${finances.totalGMV.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: 'Total value of all paid orders',
      icon: DollarSign,
      highlight: false,
    },
    {
      title: 'HiveTrace Revenue (5%)',
      value: `GH₵ ${finances.totalHiveTraceCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: '5% marketplace verification fee',
      icon: Coins,
      highlight: true,
    },
    {
      title: 'Producer Payouts (95%)',
      value: `GH₵ ${finances.totalProducerPayouts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: '95% net due to all apiaries',
      icon: TrendingUp,
      highlight: false,
    },
    {
      title: 'Pending Settlements',
      value: `GH₵ ${finances.pendingGMV.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      detail: `Fee: GH₵ ${finances.pendingCommission.toLocaleString()} · Payout: GH₵ ${finances.pendingPayouts.toLocaleString()}`,
      icon: Clock,
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
        return <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30">Pending</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <section className="motion-rise rounded-xl border border-border/60 bg-card/75 p-6 shadow-[var(--shadow-soft)] backdrop-blur sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="rounded-full bg-primary/12 text-primary">Executive Financials</Badge>
              <Badge variant="outline" className="border-primary/30 text-primary">
                5% Platform Fee Rate Active
              </Badge>
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Marketplace Revenue & Commission Oversight
            </h1>
            <p className="max-w-2xl text-muted-foreground">
              Platform-wide GMV, HiveTrace 5% fee collection, producer payout obligations, and multi-vendor order split reconciliation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/producers">
              <Button variant="outline" className="gap-2">
                <Users className="size-4" />
                Manage Producers
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

      {/* Commission Model Summary Callout */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-6 backdrop-blur">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">HiveTrace Platform Split</p>
            <p className="font-heading text-2xl font-bold text-primary">5.0%</p>
            <p className="text-xs text-muted-foreground">Quality verification, QR blockchain ledger & platform hosting</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Producer Payout Split</p>
            <p className="font-heading text-2xl font-bold text-foreground">95.0%</p>
            <p className="text-xs text-muted-foreground">Direct net earnings disbursed to apiary bank/MoMo accounts</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Total Units Dispatched</p>
            <p className="font-heading text-2xl font-bold text-foreground">{finances.totalUnitsSold} Units</p>
            <p className="text-xs text-muted-foreground">Across {finances.totalPaidOrdersCount} settled customer orders</p>
          </div>
        </div>
      </section>

      {/* Producer Payouts & Commission Summary Table */}
      <section className="rounded-xl border border-border/60 bg-card/75 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Producer Financial Ledger</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Sales performance, 5% fee collections, and 95% net payout obligations per apiary.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Producer / Business</th>
                <th className="px-6 py-4 font-semibold">Payout Destination</th>
                <th className="px-6 py-4 font-semibold text-center">Orders / Units</th>
                <th className="px-6 py-4 font-semibold text-right">Gross GMV</th>
                <th className="px-6 py-4 font-semibold text-right">5% Platform Fee</th>
                <th className="px-6 py-4 font-semibold text-right">95% Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {finances.producerBreakdowns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No registered producers found.
                  </td>
                </tr>
              ) : (
                finances.producerBreakdowns.map((p) => (
                  <tr key={p.producerId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{p.businessName}</p>
                      <p className="text-xs text-muted-foreground">{p.ownerName} · {p.location}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {p.payoutMethod === 'BANK' ? (
                          <Building className="size-3.5 text-muted-foreground" />
                        ) : (
                          <Smartphone className="size-3.5 text-muted-foreground" />
                        )}
                        <span className="font-mono text-xs text-foreground font-medium">
                          {p.payoutAccountDetails}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-medium text-foreground">{p.paidOrdersCount} orders</span>
                      <span className="text-xs text-muted-foreground block">{p.unitsSold} units</span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      GH₵ {p.grossSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-muted-foreground">
                      GH₵ {p.hiveTraceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold font-heading text-primary text-base">
                      GH₵ {p.netPayout.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Platform Orders & Commission Split Ledger */}
      <section className="rounded-xl border border-border/60 bg-card/75 shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight">Recent Order Settlements</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Multi-vendor order audit trail with automated 5% fee split breakdown.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Vendors</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Gross Total</th>
                <th className="px-6 py-4 font-semibold text-right">5% Fee</th>
                <th className="px-6 py-4 font-semibold text-right">Producer Payouts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {finances.recentPlatformOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No marketplace orders recorded yet.
                  </td>
                </tr>
              ) : (
                finances.recentPlatformOrders.map((o) => (
                  <tr key={o.orderId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold bg-muted px-2 py-1 rounded">
                        #{o.orderId.slice(-6).toUpperCase()}
                      </span>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        {new Date(o.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{o.consumerName}</p>
                      {o.consumerEmail && <p className="text-xs text-muted-foreground">{o.consumerEmail}</p>}
                    </td>
                    <td className="px-6 py-4">
                      {o.isMultiProducerCart ? (
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                          <Layers className="mr-1 size-3" /> {o.producersCount} Apiaries
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">1 Apiary</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(o.status)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      GH₵ {o.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-muted-foreground">
                      GH₵ {o.hiveTraceFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold font-heading text-primary">
                      GH₵ {o.producerPayoutsTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
