'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, Users, Package } from 'lucide-react';

export default function AdminPage() {
  const stats = [
    {
      title: 'Total Producers',
      value: '342',
      change: '+12',
      icon: Users,
    },
    {
      title: 'Verified Batches',
      value: '2,847',
      change: '+156',
      icon: Package,
    },
    {
      title: 'Fraud Alerts',
      value: '8',
      change: '+2',
      icon: AlertTriangle,
    },
    {
      title: 'Total Scans',
      value: '45.2K',
      change: '+3.2K',
      icon: TrendingUp,
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Duplicate QR Code',
      producer: 'Valley Farms Inc',
      batch: 'HT-2024-VAL-045',
      severity: 'high',
      date: '2 hours ago',
    },
    {
      id: 2,
      type: 'Suspicious Geo Location',
      producer: 'Sunny Apiary',
      batch: 'HT-2024-SUN-023',
      severity: 'medium',
      date: '5 hours ago',
    },
    {
      id: 3,
      type: 'Unusual Scan Pattern',
      producer: 'Golden Valley',
      batch: 'HT-2024-GVA-001',
      severity: 'low',
      date: '1 day ago',
    },
  ];

  const pendingApprovals = [
    {
      id: 1,
      producer: 'Hillside Honey Co',
      type: 'New Producer',
      date: 'Today',
    },
    {
      id: 2,
      producer: 'Crystal Clear Apiaries',
      type: 'New Producer',
      date: 'Yesterday',
    },
    {
      id: 3,
      producer: 'Urban Bee Keepers',
      type: 'Producer Verification',
      date: '2 days ago',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor platform health and manage producers</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">{stat.change} this month</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Fraud Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Recent Fraud Alerts</h2>
              <p className="text-muted-foreground">System detected suspicious activity</p>
            </div>
            <Link href="/admin/fraud">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <Card key={alert.id} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{alert.type}</p>
                        <Badge
                          className={
                            alert.severity === 'high'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : alert.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.producer} • {alert.batch}
                      </p>
                      <p className="text-xs text-muted-foreground">{alert.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Investigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <Card className="border-border h-fit">
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>New producers awaiting verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border-b border-border pb-3 last:border-0 space-y-2">
                <p className="font-semibold text-sm">{approval.producer}</p>
                <p className="text-xs text-muted-foreground">{approval.type}</p>
                <p className="text-xs text-muted-foreground">{approval.date}</p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Review
                </Button>
              </div>
            ))}
            <Link href="/admin/producers">
              <Button variant="outline" size="sm" className="w-full text-xs mt-2">
                View All
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
