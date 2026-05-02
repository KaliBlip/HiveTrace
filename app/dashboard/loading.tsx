import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-muted rounded-md"></div>
          <div className="h-4 w-48 bg-muted rounded-md"></div>
        </div>
        <div className="h-12 w-48 bg-muted rounded-lg shadow-lg"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-muted"></div>
                <div className="h-3 w-16 bg-muted rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Batches Skeleton */}
        <Card className="lg:col-span-2 border-border shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-32 bg-muted rounded"></div>
              <div className="h-4 w-48 bg-muted rounded"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-muted rounded-xl"></div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-2">
              <div className="h-5 w-24 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-2 w-full bg-muted rounded-full"></div>
            </CardContent>
          </Card>
          <Card className="border-border h-24 bg-muted/20"></Card>
        </div>
      </div>
    </div>
  );
}
