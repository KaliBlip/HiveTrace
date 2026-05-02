import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getFraudAlerts } from '@/lib/actions/scan-actions';

export default async function FraudDetectionPage() {
  const alerts = await getFraudAlerts();

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
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'INVESTIGATING':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'RESOLVED':
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
      case 'IMPOSSIBLE_TRAVEL': return 'Impossible Travel';
      case 'DUPLICATE_QR': return 'Duplicate QR Code';
      case 'GEO_MISMATCH': return 'Geo Mismatch';
      case 'SUSPICIOUS_ACTIVITY': return 'Suspicious Activity';
      default: return type;
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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-black text-red-600">{alerts.filter(a => a.severity === 'HIGH').length}</p>
              <p className="text-xs font-bold uppercase text-red-600/70 tracking-wider">High Severity</p>
            </CardContent>
          </Card>
          <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-black text-yellow-600">{alerts.filter(a => a.status === 'PENDING').length}</p>
              <p className="text-xs font-bold uppercase text-yellow-600/70 tracking-wider">Pending Review</p>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-black text-green-600">{alerts.filter(a => a.status === 'RESOLVED').length}</p>
              <p className="text-xs font-bold uppercase text-green-600/70 tracking-wider">Resolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search by batch or type..." className="pl-10" />
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border-border hover:shadow-md transition">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getTypeIcon(alert.type)}
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">{getTypeLabel(alert.type)}</h3>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity?.toLowerCase()}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status?.toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Batch</p>
                    <p className="font-mono text-sm">{alert.batch?.batchCode || (alert.batchId ?? 'N/A').slice(-8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Detected</p>
                    <p className="font-semibold text-sm">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">Investigate</Button>
                  <Button variant="outline" size="sm">View Batch</Button>
                  <Button variant="outline" size="sm" className="text-green-600 hover:bg-green-50">Mark Resolved</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {alerts.length === 0 && (
          <Card className="border-border p-12 text-center space-y-3">
            <ShieldAlert className="w-12 h-12 mx-auto text-green-500" />
            <h3 className="text-xl font-bold">All Clear</h3>
            <p className="text-muted-foreground">No fraud alerts detected. The system is actively monitoring all scans.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
