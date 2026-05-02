import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-10 w-64 bg-muted rounded-md"></div>
        <div className="h-4 w-96 bg-muted rounded-md"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg"></div>
              </div>
              <div className="h-4 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Fraud Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-muted rounded"></div>
              <div className="h-4 w-64 bg-muted rounded"></div>
            </div>
            <div className="h-8 w-20 bg-muted rounded"></div>
          </div>

          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-5 w-40 bg-muted rounded"></div>
                      <div className="h-4 w-60 bg-muted rounded"></div>
                      <div className="h-3 w-20 bg-muted rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <Card className="border-border h-fit">
          <CardHeader className="space-y-2">
            <div className="h-5 w-32 bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-3 w-1/2 bg-muted rounded"></div>
                <div className="h-8 w-full bg-muted rounded"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
