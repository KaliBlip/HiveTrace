'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { TrendingUp, Package, Star, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Producer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your honey batches and sales.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+2 this month</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified QR Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground mt-1">+120 today</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground mt-1">From 128 reviews</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reputation Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">950</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent standing</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your honey batches and reputation</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <Link href="/dashboard/batches/new">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground justify-start gap-2">
              <Package className="w-4 h-4" />
              Create New Batch
            </Button>
          </Link>
          <Link href="/dashboard/reviews">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Star className="w-4 h-4" />
              View Reviews
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Batches</CardTitle>
            <CardDescription>Your most recent honey batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Wildflower Blend 2024', scans: 234, date: '2 days ago' },
                { name: 'Clover Premium', scans: 189, date: '5 days ago' },
                { name: 'Spring Collection', scans: 412, date: '1 week ago' },
              ].map((batch, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">{batch.name}</p>
                    <p className="text-sm text-muted-foreground">{batch.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{batch.scans}</p>
                    <p className="text-sm text-muted-foreground">scans</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Batch Performance</CardTitle>
            <CardDescription>Weekly QR scan trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">This Week</span>
                  <span className="text-sm text-primary font-semibold">+15%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-full rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Last Week</span>
                  <span className="text-sm text-muted-foreground">2.1K scans</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">2 Weeks Ago</span>
                  <span className="text-sm text-muted-foreground">1.8K scans</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-accent h-full rounded-full" style={{ width: '55%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-yellow-400/30 bg-yellow-50/30 dark:bg-yellow-900/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
            <CardTitle>Pending Review</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Your 3 new batches are pending admin verification. This usually takes 24-48 hours.
        </CardContent>
      </Card>
    </div>
  );
}
