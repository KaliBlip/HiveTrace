'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    {
      title: 'Monthly Platform Report',
      description: 'Comprehensive overview of platform metrics and activities',
      period: 'May 2024',
      generated: '2024-05-02',
      records: '2,847 batches, 342 producers, 45.2K scans',
    },
    {
      title: 'Fraud Detection Report',
      description: 'Summary of detected fraud cases and prevention measures',
      period: 'May 2024',
      generated: '2024-05-02',
      records: '8 active cases, 3 resolved',
    },
    {
      title: 'Producer Performance Report',
      description: 'Analytics on top performing producers and ratings',
      period: 'Q2 2024',
      generated: '2024-04-30',
      records: 'Top 10 producers, average rating 4.7',
    },
    {
      title: 'Consumer Engagement Report',
      description: 'Metrics on consumer scanning and verification activities',
      period: 'May 2024',
      generated: '2024-05-02',
      records: '12.3K unique scanners, 45.2K total scans',
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
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Download className="w-4 h-4" />
                Download Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Custom Report Generator</CardTitle>
          <CardDescription>Create custom reports with specific date ranges and metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <select className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                <option>Platform Overview</option>
                <option>Producer Performance</option>
                <option>Fraud Detection</option>
                <option>Consumer Engagement</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input type="date" className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium">End Date</label>
              <input type="date" className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground" />
            </div>
          </div>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
