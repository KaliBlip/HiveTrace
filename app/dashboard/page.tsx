import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrendingUp, Package, Star, AlertCircle, Clock, ChevronRight } from 'lucide-react';
import { getProducerStats } from '@/lib/actions/producer-actions';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');
  
  const role = (session.user as any).role;
  if (role === 'CONSUMER') redirect('/shop');
  if (role === 'ADMIN') redirect('/admin');

  const statsData = await getProducerStats();

  const stats = [
    {
      title: 'Total Batches',
      value: statsData.batchCount.toLocaleString(),
      change: 'Active',
      icon: Package,
    },
    {
      title: 'QR Scans',
      value: statsData.scanCount.toLocaleString(),
      change: 'Lifetime',
      icon: TrendingUp,
    },
    {
      title: 'Avg Rating',
      value: (statsData.producer as any).ratings?.averageRating?.toFixed(1) || '5.0',
      change: 'From consumers',
      icon: Star,
    },
    {
      title: 'Reputation',
      value: ((statsData.producer as any).ratings?.averageRating || 5.0 * 200).toFixed(0), // Mock reputation math
      change: 'Trust score',
      icon: Star,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight">Producer Dashboard</h1>
          <p className="text-muted-foreground font-medium">Monitoring {statsData.producer.businessName || 'your apiary'}</p>
        </div>
        <Link href="/dashboard/batches/new">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 font-bold shadow-lg gap-2">
            <Package className="w-4 h-4" />
            Create New Batch
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border group hover:border-primary/50 transition-colors shadow-sm">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.change}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-muted-foreground group-hover:text-foreground transition-colors">{stat.title}</p>
                  <p className="text-3xl font-black mt-1 tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Batches */}
        <Card className="lg:col-span-2 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Batches</CardTitle>
              <CardDescription>Latest registered honey production</CardDescription>
            </div>
            <Link href="/dashboard/batches">
              <Button variant="ghost" size="sm" className="font-bold gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statsData.recentBatches.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground italic">
                  No batches created yet.
                </div>
              ) : (
                statsData.recentBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                        {batch.honeyType.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm group-hover:text-primary transition-colors">{batch.batchCode}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" />
                          {new Date(batch.createdAt).toLocaleDateString()}
                          <span className="opacity-30">•</span>
                          {batch.honeyType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">{batch._count.qrCodes}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scans</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {/* Reputation Alert */}
          <Card className="border-primary/20 bg-primary/5 shadow-inner">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Reputation</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your reputation is calculated based on scan verification rates and consumer reviews.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span>Trust Level</span>
                  <span className="text-primary">{(((statsData.producer as any).ratings?.averageRating || 5) * 20).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000" 
                    style={{ width: `${((statsData.producer as any).ratings?.averageRating || 5) * 20}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Alerts */}
          {!statsData.producer.verified && (
            <Card className="border-yellow-400/30 bg-yellow-50/50 dark:bg-yellow-900/10 shadow-sm animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <CardTitle className="text-lg">Pending Verification</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground font-medium">
                Your producer profile is still being reviewed by the HiveTrace team. Full features will be unlocked once verified.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
