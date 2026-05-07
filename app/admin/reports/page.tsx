import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar, FileText } from 'lucide-react';
import { getPlatformReportStats } from '@/lib/actions/reports-actions';
import { ReportDownloadButton } from '@/components/admin/report-download-button';

export default async function AdminReportsPage() {
  const stats = await getPlatformReportStats();

  const reports = [
    {
      title: 'Platform Overview Report',
      description: 'Comprehensive overview of platform metrics and activities',
      period: 'All Time',
      generated: new Date().toLocaleDateString(),
      records: `${stats.batchCount.toLocaleString()} batches, ${stats.producerCount.toLocaleString()} producers, ${stats.scanCount.toLocaleString()} scans`,
    },
    {
      title: 'Fraud Detection Report',
      description: 'Summary of detected fraud cases and prevention measures',
      period: 'All Time',
      generated: new Date().toLocaleDateString(),
      records: `${stats.fraudAlertCount} active flagged cases`,
    },
    {
      title: 'Producer Performance Report',
      description: 'Analytics on producers and platform ratings',
      period: 'All Time',
      generated: new Date().toLocaleDateString(),
      records: `${stats.producerCount.toLocaleString()} producers, ${stats.reviewCount.toLocaleString()} reviews`,
    },
    {
      title: 'Consumer Engagement Report',
      description: 'Metrics on consumer scanning and verification activities',
      period: 'All Time',
      generated: new Date().toLocaleDateString(),
      records: `${stats.consumerCount.toLocaleString()} consumers, ${stats.orderCount.toLocaleString()} orders`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Generate and download platform reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="border-border">
            <CardHeader>
              <CardTitle className="text-lg">{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Period: {report.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">Generated: {report.generated}</p>
                <p className="text-sm font-medium">{report.records}</p>
              </div>
              <ReportDownloadButton title={report.title} stats={stats} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Platform Snapshot</CardTitle>
          <CardDescription>Live metrics from the HiveTrace database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.batchCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Batches</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.producerCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Producers</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.scanCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Scans</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.orderCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Orders</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.consumerCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Consumers</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.reviewCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Reviews</p>
            </div>
            <div className="bg-muted/50 p-4 rounded-xl text-center">
              <p className="text-2xl font-black">{stats.fraudAlertCount}</p>
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest mt-1">Fraud Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
