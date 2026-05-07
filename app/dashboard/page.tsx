import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { TrendingUp, Package, Star, AlertCircle, Clock, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
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
      change: 'Active Production',
      icon: Package,
    },
    {
      title: 'Network Scans',
      value: statsData.scanCount.toLocaleString(),
      change: 'Verified Hits',
      icon: Zap,
    },
    {
      title: 'Avg Rating',
      value: (statsData.producer as any).ratings?.averageRating?.toFixed(1) || '5.0',
      change: 'Consumer Trust',
      icon: Star,
    },
    {
      title: 'Trust Score',
      value: ((statsData.producer as any).ratings?.averageRating || 5.0 * 20).toFixed(0),
      change: 'Global Reputation',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto p-6 lg:p-12 space-y-12 pb-24">
      {/* Header */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border/40">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">
              Network Statistics
            </Badge>
            <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tighter uppercase italic leading-none">
              DASHBOARD <span className="text-primary not-italic">OVERVIEW.</span>
            </h1>
            <p className="text-stone-500 font-normal text-xl">
              Monitoring <span className="text-stone-900 font-bold">{statsData.producer.businessName || 'your artisan apiary'}</span>
            </p>
          </div>
          <Link href="/dashboard/batches/new">
            <Button className="rounded-full h-16 px-10 font-bold shadow-2xl shadow-primary/20 gap-4 text-xl transition-all hover:scale-105 active:scale-95 group">
              <Package className="w-6 h-6" />
              Register Batch
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-card rounded-[40px] border border-border/50 p-10 space-y-8 group hover:border-primary/30 transition-all hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-border/40 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="w-8 h-8" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-border/50 px-4 py-1.5 text-stone-400 bg-white shadow-sm">
                  {stat.change}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">{stat.title}</p>
                <p className="text-5xl font-heading font-bold tracking-tighter text-stone-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Recent Batches */}
        <div className="lg:col-span-2 bg-card rounded-[48px] border border-border/50 overflow-hidden shadow-sm flex flex-col">
          <div className="p-12 flex flex-row items-center justify-between border-b border-border/40 bg-stone-50/30">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold uppercase tracking-tight italic">Recent Batches</h2>
              <p className="text-stone-500 font-normal text-lg italic">Latest cryptographic registrations</p>
            </div>
            <Link href="/dashboard/batches">
              <Button variant="outline" className="font-bold gap-3 text-stone-900 border-2 border-stone-200 hover:border-primary hover:text-primary rounded-full px-8 h-14 uppercase tracking-widest text-xs transition-all">
                View Ledger <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="p-12 flex-1">
            <div className="space-y-8">
              {statsData.recentBatches.length === 0 ? (
                <div className="py-32 text-center text-stone-400 font-normal italic bg-stone-50/50 rounded-[32px] border-2 border-dashed border-border/60">
                  <Package className="w-16 h-16 mx-auto mb-6 opacity-20" />
                  No batches created yet.
                </div>
              ) : (
                statsData.recentBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-8 rounded-[32px] border border-border/40 hover:bg-stone-50 transition-all group relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-2 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform"></div>
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 bg-[#1c1917] rounded-2xl flex items-center justify-center text-primary font-heading font-bold text-2xl shadow-xl">
                        {batch.honeyType.charAt(0)}
                      </div>
                      <div className="space-y-2">
                        <p className="font-heading font-bold text-2xl group-hover:text-primary transition-colors tracking-tight">{batch.batchCode}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            {new Date(batch.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                          </span>
                          <span className="opacity-30">|</span>
                          <span className="text-stone-900">{batch.honeyType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-4xl text-stone-900 tracking-tighter">{batch._count.qrCodes}</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mt-1">Total Scans</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Reputation Card */}
          <div className="bg-[#1c1917] text-white rounded-[48px] p-12 relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] transition-all group-hover:bg-primary/20"></div>
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 transition-transform group-hover:rotate-12">
                  <ShieldCheck className="w-9 h-9 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-heading font-bold uppercase italic tracking-tight leading-none">Trust Score</h3>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-[0.3em]">Network Verified</p>
                </div>
              </div>
              
              <p className="text-stone-400 text-lg font-normal leading-relaxed">
                Calculated via cryptographic verification rates and direct consumer feedback.
              </p>
              
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Tier Status</p>
                    <p className="text-3xl font-heading font-bold italic uppercase tracking-tight">ELITE GRADE</p>
                  </div>
                  <span className="text-6xl font-heading font-bold text-primary italic tracking-tighter leading-none">
                    {(((statsData.producer as any).ratings?.averageRating || 5) * 20).toFixed(0)}%
                  </span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/10">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_30px_rgba(255,184,0,0.4)]" 
                    style={{ width: `${((statsData.producer as any).ratings?.averageRating || 5) * 20}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Alerts */}
          {!statsData.producer.verified && (
            <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-[40px] p-10 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-amber-500 animate-pulse" />
                <h3 className="text-xl font-heading font-bold uppercase tracking-tight text-amber-600 italic">Action Required</h3>
              </div>
              <p className="text-sm text-stone-600 font-normal leading-relaxed">
                Your producer profile is still being reviewed by our verification team. Full marketplace features will be unlocked once your credentials are confirmed.
              </p>
              <Button variant="ghost" className="w-full h-14 border-2 border-amber-500/20 rounded-2xl text-amber-600 font-bold uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-white transition-all">
                Check Status
              </Button>
            </div>
          )}

          {/* Quick Tip */}
          <div className="bg-stone-50 rounded-[40px] border border-border/50 p-10 space-y-6">
            <p className="text-[10px] font-bold uppercase text-stone-400 tracking-[0.2em]">Efficiency Tip</p>
            <p className="text-stone-900 font-bold italic leading-relaxed">
              "Regularly updating your apiary photos increases consumer trust score by up to 15%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
