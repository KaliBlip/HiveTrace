'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FraudDetectionPage() {
  const fraudCases = [
    {
      id: 1,
      type: 'Duplicate QR Code',
      description: 'Multiple batches found with identical QR codes',
      producer: 'Valley Farms Inc',
      batch: 'HT-2024-VAL-045',
      severity: 'high',
      detected: '2024-05-02 14:30',
      status: 'investigating',
    },
    {
      id: 2,
      type: 'Suspicious Geo Location',
      description: 'QR codes scanned from unexpected geographic location',
      producer: 'Sunny Apiary',
      batch: 'HT-2024-SUN-023',
      severity: 'medium',
      detected: '2024-05-02 09:15',
      status: 'flagged',
    },
    {
      id: 3,
      type: 'Unusual Scan Pattern',
      description: 'Batch received abnormal volume of scans in short timeframe',
      producer: 'Golden Valley',
      batch: 'HT-2024-GVA-001',
      severity: 'low',
      detected: '2024-05-01 16:45',
      status: 'resolved',
    },
    {
      id: 4,
      type: 'Hash Mismatch',
      description: 'HMAC-SHA256 hash verification failed for batch',
      producer: 'Hillside Farms',
      batch: 'HT-2024-HFS-089',
      severity: 'high',
      detected: '2024-04-30 11:22',
      status: 'investigating',
    },
    {
      id: 5,
      type: 'Rapid Batch Creation',
      description: 'Producer created 50+ batches in 24 hours',
      producer: 'New Producer LLC',
      batch: 'Multiple',
      severity: 'medium',
      detected: '2024-04-29 08:00',
      status: 'resolved',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'flagged':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold">Fraud Detection</h1>
          <p className="text-muted-foreground">Monitor and investigate suspicious activities</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by producer, batch, or type..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              More
            </Button>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {fraudCases.map((case_) => (
          <Card key={case_.id} className="border-border hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg">{case_.type}</h3>
                    <p className="text-sm text-muted-foreground">{case_.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(case_.severity)}>
                      {case_.severity}
                    </Badge>
                    <Badge className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Producer</p>
                    <p className="font-semibold">{case_.producer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Batch</p>
                    <p className="font-mono text-sm">{case_.batch}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Detected</p>
                    <p className="font-semibold text-sm">{case_.detected}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact Producer
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
