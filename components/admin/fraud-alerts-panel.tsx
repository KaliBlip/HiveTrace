'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, ShieldAlert, AlertTriangle, Activity, Loader2 } from 'lucide-react';
import { updateFraudAlertStatus } from '@/lib/actions/admin-actions';
import { toast } from 'sonner';

type FraudAlert = {
  id: string;
  type: string;
  severity: string;
  status: string;
  description: string;
  createdAt: Date | string;
  batchId: string | null;
  batch?: { batchCode: string; id: string } | null;
};

interface FraudAlertsPanelProps {
  initialAlerts: FraudAlert[];
}

export function FraudAlertsPanel({ initialAlerts }: FraudAlertsPanelProps) {
  const router = useRouter();
  const [alerts, setAlerts] = useState(initialAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'FLAGGED':
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'INVESTIGATING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'RESOLVED':
      case 'DISMISSED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMPOSSIBLE_TRAVEL':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'DUPLICATE_QR':
        return <ShieldAlert className="w-5 h-5 text-orange-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'IMPOSSIBLE_TRAVEL':
        return 'Impossible Travel';
      case 'DUPLICATE_QR':
        return 'Duplicate QR Code';
      case 'GEO_MISMATCH':
        return 'Geo Mismatch';
      case 'SUSPICIOUS_ACTIVITY':
        return 'Suspicious Activity';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const term = searchQuery.toLowerCase();
      const matchesSearch =
        !term ||
        alert.type.toLowerCase().includes(term) ||
        alert.description.toLowerCase().includes(term) ||
        alert.batch?.batchCode?.toLowerCase().includes(term);

      const matchesSeverity =
        severityFilter === 'all' || alert.severity.toLowerCase() === severityFilter;
      const matchesStatus =
        statusFilter === 'all' || alert.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, searchQuery, severityFilter, statusFilter]);

  const handleStatusUpdate = (id: string, status: 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED') => {
    setPendingId(id);
    startTransition(async () => {
      try {
        const updated = await updateFraudAlertStatus(id, status);
        setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
        toast.success(
          status === 'INVESTIGATING'
            ? 'Alert marked as investigating'
            : status === 'RESOLVED'
              ? 'Alert resolved'
              : 'Alert dismissed'
        );
        router.refresh();
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : 'Failed to update alert');
      } finally {
        setPendingId(null);
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Fraud Detection</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Monitor and investigate suspicious activities</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10 dark:border-red-800/40">
            <CardContent className="p-4 sm:pt-6 text-center">
              <p className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400">
                {alerts.filter((a) => a.severity === 'HIGH').length}
              </p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-red-600/70 dark:text-red-400/70 tracking-wider mt-1">High Severity</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10 dark:border-yellow-800/40">
            <CardContent className="p-4 sm:pt-6 text-center">
              <p className="text-2xl sm:text-3xl font-black text-yellow-600 dark:text-yellow-400">
                {alerts.filter((a) => ['FLAGGED', 'PENDING'].includes(a.status)).length}
              </p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-yellow-600/70 dark:text-yellow-400/70 tracking-wider mt-1">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/40">
            <CardContent className="p-4 sm:pt-6 text-center">
              <p className="text-2xl sm:text-3xl font-black text-green-600 dark:text-green-400">
                {alerts.filter((a) => a.status === 'RESOLVED').length}
              </p>
              <p className="text-[10px] sm:text-xs font-bold uppercase text-green-600/70 dark:text-green-400/70 tracking-wider mt-1">Resolved</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by batch or type..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="border-border hover:shadow-md transition">
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                    <div className="shrink-0 mt-0.5">{getTypeIcon(alert.type)}</div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg">{getTypeLabel(alert.type)}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2 shrink-0 ml-7 sm:ml-0">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity?.toLowerCase()}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status?.toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-border">
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Batch</p>
                    <p className="font-mono text-xs sm:text-sm truncate">
                      {alert.batch?.batchCode || (alert.batchId ?? 'N/A').slice(-8)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Detected</p>
                    <p className="font-semibold text-xs sm:text-sm">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {alert.status !== 'INVESTIGATING' && alert.status !== 'RESOLVED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pendingId === alert.id}
                      onClick={() => handleStatusUpdate(alert.id, 'INVESTIGATING')}
                    >
                      {pendingId === alert.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Investigate'
                      )}
                    </Button>
                  )}
                  {alert.batch?.id && (
                    <Link href={`/admin/batches/${alert.batch.id}`}>
                      <Button variant="outline" size="sm">
                        View Batch
                      </Button>
                    </Link>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950/30"
                      disabled={pendingId === alert.id}
                      onClick={() => handleStatusUpdate(alert.id, 'RESOLVED')}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredAlerts.length === 0 && (
          <Card className="border-border p-8 sm:p-12 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-green-500" />
            <h3 className="text-lg sm:text-xl font-bold">All Clear</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              No fraud alerts match your filters. The system is actively monitoring all scans.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
