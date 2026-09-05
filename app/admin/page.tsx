import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Users, Package, Clock } from 'lucide-react';
import { getAdminStats } from '@/lib/actions/admin-actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  if ((session.user as any).role !== 'ADMIN') redirect('/dashboard');
  const statsData = await getAdminStats();

  const stats = [
    {
      title: 'Total Producers',
      value: statsData.producerCount.toLocaleString(),
      change: statsData.trends?.producers
        ? `+${statsData.trends.producers} this week`
        : '—',
      icon: Users,
    },
    {
      title: 'Verified Batches',
      value: statsData.batchCount.toLocaleString(),
      change: statsData.trends?.batches
        ? `+${statsData.trends.batches} this week`
        : '—',
      icon: Package,
    },
    {
      title: 'Active Alerts',
      value: statsData.fraudAlertCount.toLocaleString(),
      change: statsData.fraudAlertCount > 5 ? 'High' : 'Stable',
      icon: AlertTriangle,
      alert: statsData.fraudAlertCount > 0,
    },
    {
      title: 'Total Scans',
      value: statsData.scanCount.toLocaleString(),
      change: statsData.trends?.scans
        ? `+${statsData.trends.scans} this week`
        : '—',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Platform health and producer management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`border-border group hover:border-primary/50 transition-colors ${stat.alert ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-black mt-1 sm:mt-2 tracking-tighter">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${stat.alert ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-primary/10 text-primary'}`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div>
                  <p className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${stat.alert ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Fraud Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 sm:px-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Recent Fraud Alerts</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Suspicious activities flagged by HiveTrace security</p>
            </div>
            <Link href="/admin/fraud">
              <Button variant="ghost" size="sm" className="font-bold hover:bg-primary/10 hover:text-primary w-fit">
                View Reports
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {statsData.recentAlerts.length === 0 ? (
              <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 sm:p-12 text-center text-muted-foreground">
                <Package className="w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 opacity-20" />
                <p className="text-sm sm:text-base">No recent alerts detected</p>
              </Card>
            ) : (
              statsData.recentAlerts.map((alert) => (
                <Card key={alert.id} className="border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-sm sm:text-base">{alert.type.replace('_', ' ')}</p>
                          <Badge
                            className={
                              alert.severity === 'HIGH'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : alert.severity === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            }
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          Batch: <span className="font-mono text-xs">{alert.batch?.batchCode || alert.batchId}</span>
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                          <Clock className="w-3 h-3 shrink-0" />
                          {new Date(alert.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <Link href={`/admin/fraud`} className="w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="font-bold border-2 w-full sm:w-auto">
                          Investigate
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Pending Producer Approvals */}
        <div className="space-y-4">
          <Card className="border-border h-fit shadow-lg overflow-hidden">
            <div className="h-2 bg-primary"></div>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Pending Approvals</CardTitle>
              <CardDescription>Review and verify new producer applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {statsData.pendingProducers.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-8 italic">No pending approvals</p>
              ) : (
                statsData.pendingProducers.map((producer) => (
                  <div key={producer.id} className="group border-b border-border pb-4 last:border-0 last:pb-0 space-y-3">
                    <div>
                      <p className="font-bold text-sm group-hover:text-primary transition-colors">{producer.user.name}</p>
                      <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mt-1">
                        Joined {new Date(producer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold border-2 hover:bg-primary hover:text-primary-foreground transition-all" asChild>
                      <Link href={`/admin/producers?highlight=${producer.id}`}>
                        Review Application
                      </Link>
                    </Button>
                  </div>
                ))
              )}
              {statsData.pendingProducers.length > 0 && (
                <Link href="/admin/producers">
                  <Button variant="ghost" size="sm" className="w-full text-xs font-black uppercase tracking-widest mt-2 hover:text-primary">
                    View All Producers
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
