import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducerAnalytics } from '@/lib/actions/analytics-actions';
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default async function AnalyticsPage() {
  const analytics = await getProducerAnalytics();

  const scanData = analytics?.scanData || [];
  const batchPerformance = analytics?.batchPerformance || [];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Track performance metrics for your honey batches</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Batches</p>
            <p className="text-3xl font-black mt-2">{analytics?.totalBatches || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Scans</p>
            <p className="text-3xl font-black mt-2">{analytics?.totalScans || 0}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Active Products</p>
            <p className="text-3xl font-black mt-2">{analytics?.activeProducts || 0}</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsCharts scanData={scanData} batchPerformance={batchPerformance} />
    </div>
  );
}
