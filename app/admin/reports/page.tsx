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
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-1.5 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Reports</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Generate and download platform reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {reports.map((report, index) => (
          <Card key={index} className="border-border rounded-2xl sm:rounded-3xl">
            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">{report.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Period: {report.period}</span>
                </div>
                <p className="text-muted-foreground">Generated: {report.generated}</p>
                <p className="font-medium text-foreground">{report.records}</p>
              </div>
              <ReportDownloadButton title={report.title} stats={stats} />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border rounded-2xl sm:rounded-3xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Platform Snapshot</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Live metrics from the HiveTrace database</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xl sm:text-2xl font-black">{stats.batchCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Batches</p>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xl sm:text-2xl font-black">{stats.producerCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Producers</p>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xl sm:text-2xl font-black">{stats.scanCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Scans</p>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xl sm:text-2xl font-black">{stats.orderCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Orders</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xl sm:text-2xl font-black">{stats.consumerCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Consumers</p>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center">
              <p className="text-xl sm:text-2xl font-black">{stats.reviewCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Reviews</p>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-xl text-center col-span-2 sm:col-span-1">
              <p className="text-xl sm:text-2xl font-black">{stats.fraudAlertCount}</p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-muted-foreground tracking-wider mt-1">Fraud Alerts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
